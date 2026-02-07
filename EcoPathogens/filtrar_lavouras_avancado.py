"""
🌾 DETECÇÃO AVANÇADA DE PLANTAÇÕES - COROMANDEL
================================================
Sistema inteligente para filtrar APENAS plantações agrícolas comerciais,
removendo canteiros urbanos, parques e vegetação nativa.

Filtros aplicados:
1. ✅ Códigos MapBiomas corretos (agricultura comercial)
2. ✅ Área mínima (5000 m² = 0.5 hectares)
3. ✅ Compacidade (forma geométrica regular)
"""

import geopandas as gpd
import rasterio
from rasterio.mask import mask
from rasterio.features import shapes
import os
import numpy as np
from shapely.geometry import shape
import math

# ========== CONFIGURAÇÕES ==========
caminho_geojson = r"C:\projtos pessoais\NASA\EcoPathogens\data\raw_data\limites-coromandel\limite_coromandel.geojson"
caminho_tif = r"C:\projtos pessoais\NASA\EcoPathogens\data\raw_data\brazil_coverage_2024.tif"
caminho_saida = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\fazendas_monitoramento_filtrado.geojson"

# FILTROS - AJUSTADOS PARA CAPTURAR ÁREAS EM POUSIO/PREPARAÇÃO
AREA_MINIMA_M2 = 2000  # 2000 m² = 0.2 hectares (menos restritivo)
COMPACIDADE_MINIMA = 0.15  # Aceita formas menos regulares (era 0.3)

# CÓDIGOS MAPBIOMAS 8.0 - APENAS AGRICULTURA COMERCIAL
# Fonte: https://brasil.mapbiomas.org/
CODIGOS_AGRICULTURA = {
    39: "Soja",
    20: "Cana-de-açúcar", 
    40: "Arroz",
    62: "Algodão",
    46: "Café",
    47: "Citrus",
    48: "Outras Lavouras Perenes",
    # REMOVIDOS: 19 (genérico), 41 (inclui hortas), 21 (pasto)
}

# ========== FUNÇÕES DE ANÁLISE ==========

def calcular_compacidade(geometria):
    """
    Calcula a compacidade de um polígono (0-1).
    Polígonos regulares (quadrados, retângulos) têm alta compacidade.
    Formas irregulares (matas) têm baixa compacidade.
    
    Fórmula: 4π × área / perímetro²
    - Círculo perfeito = 1.0
    - Quadrado = 0.785
    - Retângulo 2:1 = 0.70
    - Forma irregular < 0.5
    """
    area = geometria.area
    perimetro = geometria.length
    
    if perimetro == 0:
        return 0
    
    compacidade = (4 * math.pi * area) / (perimetro ** 2)
    return compacidade

def calcular_area_m2(geometria, crs_epsg):
    """
    Calcula área em metros quadrados.
    Se CRS for geográfico (4326), projeta para métrico (UTM).
    """
    # Se já está em coordenadas geográficas, precisa converter
    if crs_epsg == 4326:
        # Coromandel está em UTM Zone 23S (EPSG:31983)
        gdf_temp = gpd.GeoDataFrame([1], geometry=[geometria], crs="EPSG:4326")
        gdf_temp_proj = gdf_temp.to_crs("EPSG:31983")  # UTM 23S
        return gdf_temp_proj.geometry.iloc[0].area
    else:
        return geometria.area

# ========== PROCESSAMENTO ==========

print("=" * 60)
print("🌾 SISTEMA DE DETECÇÃO AVANÇADA DE PLANTAÇÕES")
print("=" * 60)

# Criar pasta de saída
os.makedirs(os.path.dirname(caminho_saida), exist_ok=True)

# 1. Carregar limite do município
print("\n1️⃣ Carregando limites de Coromandel...")
if not os.path.exists(caminho_geojson):
    print("❌ ERRO: Arquivo limite_coromandel.geojson não encontrado!")
    exit()
    
limite_municipio = gpd.read_file(caminho_geojson)
geometria = limite_municipio.geometry.values

# 2. Processar TIF do MapBiomas
print("2️⃣ Abrindo Mapa Brasil 2024...")
if not os.path.exists(caminho_tif):
    print("❌ ERRO: Arquivo brazil_coverage_2024.tif não encontrado!")
    exit()

with rasterio.open(caminho_tif) as src:
    print("3️⃣ Recortando área de Coromandel...")
    try:
        imagem_recortada, transformacao = mask(src, geometria, crop=True)
    except Exception as e:
        print(f"❌ Erro ao recortar: {e}")
        exit()
    
    dados_imagem = imagem_recortada[0]
    
    # Extrair apenas códigos de agricultura
    ids_agricultura = list(CODIGOS_AGRICULTURA.keys())
    print(f"4️⃣ Filtrando classes agrícolas: {ids_agricultura}")
    
    mascara_plantio = np.isin(dados_imagem, ids_agricultura)
    
    print("5️⃣ Vetorizando (pixels → polígonos)...")
    resultados = (
        {'properties': {'codigo_mapbiomas': int(v)}, 'geometry': s}
        for i, (s, v) in enumerate(
            shapes(dados_imagem, mask=mascara_plantio, transform=transformacao)
        )
    )
    
    geometrias_brutas = list(resultados)

# 3. Estatísticas ANTES dos filtros
print("\n" + "=" * 60)
print("📊 ESTATÍSTICAS ANTES DOS FILTROS")
print("=" * 60)
print(f"Total de polígonos detectados: {len(geometrias_brutas)}")

if not geometrias_brutas:
    print("⚠️ AVISO: Nenhuma área agrícola encontrada!")
    exit()

# Converter para GeoDataFrame para facilitar análise
gdf_bruto = gpd.GeoDataFrame.from_features(geometrias_brutas)
gdf_bruto.set_crs(epsg=4326, inplace=True)

# 4. APLICAR FILTROS AVANÇADOS
print("\n" + "=" * 60)
print("🔍 APLICANDO FILTROS AVANÇADOS")
print("=" * 60)

# Calcular métricas para cada polígono
areas_m2 = []
compacidades = []

for idx, row in gdf_bruto.iterrows():
    geom = row.geometry
    
    # Área em m²
    area_m2 = calcular_area_m2(geom, 4326)
    areas_m2.append(area_m2)
    
    # Compacidade
    comp = calcular_compacidade(geom)
    compacidades.append(comp)

gdf_bruto['area_m2'] = areas_m2
gdf_bruto['compacidade'] = compacidades
gdf_bruto['area_hectares'] = gdf_bruto['area_m2'] / 10000

# Adicionar nome da cultura
gdf_bruto['tipo_cultura'] = gdf_bruto['codigo_mapbiomas'].map(CODIGOS_AGRICULTURA)

# FILTRO 1: Área mínima
print(f"\n🔸 Filtro 1: Área ≥ {AREA_MINIMA_M2} m² ({AREA_MINIMA_M2/10000:.2f} ha)")
antes_filtro1 = len(gdf_bruto)
gdf_filtrado = gdf_bruto[gdf_bruto['area_m2'] >= AREA_MINIMA_M2].copy()
print(f"   ✅ Mantidos: {len(gdf_filtrado)} de {antes_filtro1}")
print(f"   ❌ Removidos: {antes_filtro1 - len(gdf_filtrado)} (provavelmente canteiros/jardins)")

# FILTRO 2: Compacidade (forma)
print(f"\n🔸 Filtro 2: Compacidade ≥ {COMPACIDADE_MINIMA}")
antes_filtro2 = len(gdf_filtrado)
gdf_filtrado = gdf_filtrado[gdf_filtrado['compacidade'] >= COMPACIDADE_MINIMA].copy()
print(f"   ✅ Mantidos: {len(gdf_filtrado)} de {antes_filtro2}")
print(f"   ❌ Removidos: {antes_filtro2 - len(gdf_filtrado)} (formas muito irregulares)")

# 5. ESTATÍSTICAS FINAIS
print("\n" + "=" * 60)
print("📊 ESTATÍSTICAS FINAIS")
print("=" * 60)
print(f"Total de fazendas detectadas: {len(gdf_filtrado)}")
print(f"\nDistribuição por cultura:")
for cultura, count in gdf_filtrado['tipo_cultura'].value_counts().items():
    area_total_ha = gdf_filtrado[gdf_filtrado['tipo_cultura'] == cultura]['area_hectares'].sum()
    print(f"  • {cultura}: {count} áreas ({area_total_ha:.2f} ha)")

print(f"\nÁrea total mapeada: {gdf_filtrado['area_hectares'].sum():.2f} hectares")
print(f"Área média por fazenda: {gdf_filtrado['area_hectares'].mean():.2f} ha")
print(f"Maior fazenda: {gdf_filtrado['area_hectares'].max():.2f} ha")
print(f"Menor fazenda: {gdf_filtrado['area_hectares'].min():.2f} ha")

# 6. SALVAR RESULTADO
if len(gdf_filtrado) > 0:
    gdf_filtrado.to_file(caminho_saida, driver='GeoJSON')
    print("\n" + "=" * 60)
    print(f"✅ SUCESSO! Arquivo salvo em:")
    print(f"   {caminho_saida}")
    print("=" * 60)
else:
    print("\n⚠️ AVISO: Nenhuma fazenda passou pelos filtros.")
    print("   Tente reduzir AREA_MINIMA_M2 ou COMPACIDADE_MINIMA")
