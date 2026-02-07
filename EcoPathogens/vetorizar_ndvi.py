"""
🗺️ VETORIZAÇÃO NDVI - COROMANDEL
==================================
Converte mapa de variância NDVI em polígonos (GeoJSON)
para identificar áreas agrícolas.
"""

import geopandas as gpd
import rasterio
from rasterio.features import shapes
import numpy as np
from shapely.geometry import shape
import os

# ========== CONFIGURAÇÕES ==========
VARIANCIA_PATH = r"C:\projtos pessoais\NASA\EcoPathogens\data\sentinel_temporal\variancia_ndvi.tif"
ARQUIVO_SAIDA = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\areas_agricolas_ndvi.geojson"

# Limiares
VARIANCIA_MINIMA = 0.10  # Agricultura varia > 0.10
AREA_MINIMA_M2 = 10000  # 1 hectare

print("=" * 60)
print("🗺️ VETORIZAÇÃO - NDVI TEMPORAL")
print("=" * 60)

# Verificar se arquivo existe
if not os.path.exists(VARIANCIA_PATH):
    print(f"\n❌ ERRO: Arquivo não encontrado!")
    print(f"   Execute primeiro: deteccao_ndvi_temporal.py")
    print(f"   Esperado: {VARIANCIA_PATH}")
    exit()

# Abrir mapa de variância
print("\n1️⃣ Carregando mapa de variância NDVI...")
with rasterio.open(VARIANCIA_PATH) as src:
    variancia = src.read(1)
    transform = src.transform
    crs = src.crs
    
    print(f"   Variância: Min={np.min(variancia):.4f}, Max={np.max(variancia):.4f}")
    
    # Criar máscara para áreas com alta variância (agricultura)
    print(f"\n2️⃣ Filtrando áreas com variância ≥ {VARIANCIA_MINIMA}...")
    mascara_agricultura = variancia >= VARIANCIA_MINIMA
    
    pixels_total = np.sum(mascara_agricultura)
    print(f"   {pixels_total:,} pixels detectados como agricultura")
    
    # Vetorizar (converter pixels em polígonos)
    print("\n3️⃣ Vetorizando (pixels → polígonos)...")
    resultados = (
        {'properties': {'variancia_ndvi': float(v)}, 'geometry': s}
        for i, (s, v) in enumerate(
            shapes(variancia, mask=mascara_agricultura, transform=transform)
        )
    )
    
    geometrias = list(resultados)

print(f"   ✅ {len(geometrias)} polígonos criados")

# Converter para GeoDataFrame
gdf = gpd.GeoDataFrame.from_features(geometrias)
gdf.set_crs(crs, inplace=True)

# Calcular áreas
print(f"\n4️⃣ Calculando áreas e filtrando...")

# Converter para UTM para ter áreas em metros
gdf_utm = gdf.to_crs("EPSG:31983")  # UTM 23S (Coromandel)
gdf['area_m2'] = gdf_utm.geometry.area
gdf['area_hectares'] = gdf['area_m2'] / 10000

# Filtrar por área mínima
antes = len(gdf)
gdf = gdf[gdf['area_m2'] >= AREA_MINIMA_M2].copy()
print(f"   Removidos {antes - len(gdf)} polígonos pequenos (< 1 ha)")
print(f "   ✅ {len(gdf)} áreas agrícolas finais")

# Estatísticas
print("\n" + "=" * 60)
print("📊 ESTATÍSTICAS FINAIS")
print("=" * 60)
print(f"Total de áreas detectadas: {len(gdf)}")
print(f"Área total: {gdf['area_hectares'].sum():.2f} hectares")
print(f"Área média: {gdf['area_hectares'].mean():.2f} ha")
print(f"Maior área: {gdf['area_hectares'].max():.2f} ha")
print(f"Menor área: {gdf['area_hectares'].min():.2f} ha")

# Adicionar classificação por intensidade
def classificar_variancia(var):
    if var > 0.25:
        return "Alta intensidade"  # Agricultura intensiva
    elif var > 0.15:
        return "Média intensidade"
    else:
        return "Baixa intensidade"  # Pode ser pasto rotacionado

gdf['intensidade'] = gdf['variancia_ndvi'].apply(classificar_variancia)

print(f"\nDistribuição por intensidade:")
for intensidade, count in gdf['intensidade'].value_counts().items():
    area_total = gdf[gdf['intensidade'] == intensidade]['area_hectares'].sum()
    print(f"  • {intensidade}: {count} áreas ({area_total:.2f} ha)")

# Salvar
gdf.to_file(ARQUIVO_SAIDA, driver='GeoJSON')

print("\n" + "=" * 60)
print("✅ SUCESSO!")
print("=" * 60)
print(f"\nArquivo salvo em:")
print(f"  {ARQUIVO_SAIDA}")
print(f"\n🎯 Próximo passo:")
print(f"   Executar visualizar_fazendas_completo.py para ver no mapa")
