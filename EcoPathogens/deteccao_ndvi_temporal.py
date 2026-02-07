"""
🛰️ DETECÇÃO NDVI TEMPORAL - COROMANDEL
========================================
Detecta TODAS áreas agrícolas (plantadas, pousio, solo preparado) 
analisando mudanças de vegetação ao longo de 12 meses.

Metodologia:
1. Baixar Sentinel-2 de 3 datas (Jan/Jul/Dez 2024)
2. Calcular NDVI para cada data
3. Calcular variância NDVI
4. Agricultura: variância alta (0.2 → 0.8 → 0.3)
5. Vegetação nativa: variância baixa (~0.6-0.7 estável)
"""

import geopandas as gpd
import numpy as np
import rasterio
from rasterio.mask import mask
from rasterio.warp import calculate_default_transform, reproject, Resampling
import requests
from datetime import datetime
import os
from pathlib import Path
from pystac_client import Client

# ========== CONFIGURAÇÕES ==========
LIMITE_GEOJSON = r"C:\projtos pessoais\NASA\EcoPathogens\data\raw_data\limites-coromandel\limite_coromandel.geojson"
PASTA_SAIDA = r"C:\projtos pessoais\NASA\EcoPathogens\data\sentinel_temporal"
ARQUIVO_RESULTADO = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\areas_agricolas_ndvi.geojson"

# Credenciais Copernicus (do seu buscar_satelite.py)
COPERNICUS_USER = "contato@union.dev.br"
COPERNICUS_PASS = ",M$,Z#nZPucu_d7"

# Datas para análise temporal (3 pontos ao longo do ano)
DATAS_ANALISE = [
    ("2024-01-01", "2024-01-31"),  # Verão - Plantio/Crescimento
    ("2024-07-01", "2024-07-31"),  # Inverno - Colheita/Pousio
    ("2024-12-01", "2024-12-31"),  # Fim de ano - Preparação
]

# Limiares
VARIANCIA_NDVI_MINIMA = 0.10  # Agricultura varia > 0.10, vegetação nativa < 0.10
AREA_MINIMA_M2 = 10000  # 1 hectare (menos restritivo que antes)
MAX_NUVENS = 30  # % máximo de nuvens

os.makedirs(PASTA_SAIDA, exist_ok=True)

print("=" * 70)
print("🛰️ DETECÇÃO NDVI TEMPORAL - SENTINEL-2")
print("=" * 70)

# ========== FUNÇÕES ==========

def buscar_imagens_stac(bbox, data_inicio, data_fim, max_nuvens=30):
    """Busca imagens Sentinel-2 via STAC API usando pystac_client"""
    print(f"\n📡 Buscando imagens de {data_inicio} a {data_fim}...")
    
    try:
        # Conectar ao catálogo STAC
        catalog = Client.open("https://catalogue.dataspace.copernicus.eu/stac")
        
        # Buscar
        search = catalog.search(
            collections=["sentinel-2-l2a"],
            bbox=bbox,
            datetime=f"{data_inicio}/{data_fim}",
            query={"eo:cloud_cover": {"lt": max_nuvens}},
            max_items=10
        )
        
        items = list(search.items())
        
        if items:
            # Ordenar por menor cobertura de nuvens
            items.sort(key=lambda x: x.properties["eo:cloud_cover"])
            melhor = items[0]
            print(f"✅ Encontradas {len(items)} imagens")
            print(f"   Melhor: {melhor.id} ({melhor.properties['eo:cloud_cover']:.1f}% nuvens)")
            return melhor
        else:
            print(f"⚠️ Nenhuma imagem encontrada")
            return None
            
    except Exception as e:
        print(f"❌ Erro na busca: {e}")
        import traceback
        traceback.print_exc()
        return None

def baixar_banda(url, output_path):
    """Baixa banda do Sentinel-2 usando URL público"""
    
    try:
        print(f"   Baixando {Path(output_path).name}...")
        response = requests.get(url, stream=True, timeout=120)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192*16):
                f.write(chunk)
        
        print(f"   ✅ Salvo: {output_path}")
        return True
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def calcular_ndvi(red_path, nir_path, output_path, geometria):
    """Calcula NDVI e recorta para área de interesse"""
    print(f"\n📊 Calculando NDVI...")
    
    try:
        # Abrir bandas
        with rasterio.open(red_path) as red_src:
            with rasterio.open(nir_path) as nir_src:
                # Recortar para geometria
                red_crop, red_transform = mask(red_src, geometria, crop=True)
                nir_crop, nir_transform = mask(nir_src, geometria, crop=True)
                
                red_data = red_crop[0].astype(float)
                nir_data = nir_crop[0].astype(float)
                
                # NDVI = (NIR - Red) / (NIR + Red)
                ndvi = np.where(
                    (nir_data + red_data) != 0,
                    (nir_data - red_data) / (nir_data + red_data),
                    0
                )
                
                # Salvar NDVI
                profile = red_src.profile
                profile.update(
                    dtype=rasterio.float32,
                    count=1,
                    transform=red_transform,
                    width=ndvi.shape[1],
                    height=ndvi.shape[0]
                )
                
                with rasterio.open(output_path, 'w', **profile) as dst:
                    dst.write(ndvi.astype(np.float32), 1)
                
                print(f"✅ NDVI salvo: {output_path}")
                print(f"   Min: {np.min(ndvi):.3f} | Max: {np.max(ndvi):.3f} | Média: {np.mean(ndvi):.3f}")
                return True
                
    except Exception as e:
        print(f"❌ Erro ao calcular NDVI: {e}")
        return False

# ========== PROCESSAMENTO PRINCIPAL ==========

print("\n1️⃣ Carregando limites de Coromandel...")
gdf_limite = gpd.read_file(LIMITE_GEOJSON)
geometria = gdf_limite.geometry.values
bbox = gdf_limite.total_bounds  # [minx, miny, maxx, maxy]

print(f"   BBOX: {bbox}")

# Processar cada data
ndvi_paths = []

for idx, (data_inicio, data_fim) in enumerate(DATAS_ANALISE):
    print("\n" + "=" * 70)
    print(f"📅 PROCESSANDO PERÍODO {idx+1}/3: {data_inicio} a {data_fim}")
    print("=" * 70)
    
    # Buscar melhor imagem do período
    imagem = buscar_imagens_stac(bbox.tolist(), data_inicio, data_fim, MAX_NUVENS)
    
    if not imagem:
        print("⚠️ Pulando este período (sem imagens válidas)")
        continue
    
    # Extrair links das bandas Red (B04) e NIR (B08)
    assets = imagem.assets
    
    red_url = None
    nir_url = None
    
    # Buscar as bandas corretas
    if "B04" in assets:
        red_url = assets["B04"].href
    if "B08" in assets:
        nir_url = assets["B08"].href
    
    if not red_url or not nir_url:
        print("❌ Bandas Red/NIR não encontradas nesta imagem")
        print(f"   Bandas disponíveis: {list(assets.keys())}")
        continue
    
    print(f"\n📥 Baixando bandas...")
    
    # Caminhos locais
    periodo = data_inicio.replace("-", "")
    red_local = os.path.join(PASTA_SAIDA, f"red_{periodo}.tif")
    nir_local = os.path.join(PASTA_SAIDA, f"nir_{periodo}.tif")
    ndvi_local = os.path.join(PASTA_SAIDA, f"ndvi_{periodo}.tif")
    
    # Baixar bandas
    if not baixar_banda(red_url, red_local):
        continue
    if not baixar_banda(nir_url, nir_local):
        continue
    
    # Calcular NDVI
    if calcular_ndvi(red_local, nir_local, ndvi_local, geometria):
        ndvi_paths.append(ndvi_local)
    
    # Limpar bandas brutas (economizar espaço)
    try:
        os.remove(red_local)
        os.remove(nir_local)
        print(f"   🗑️ Bandas brutas removidas (economia de espaço)")
    except:
        pass

# ========== ANÁLISE DE VARIÂNCIA ==========

if len(ndvi_paths) < 2:
    print("\n❌ ERRO: Precisa de pelo menos 2 datas para calcular variância!")
    print("   Tente aumentar MAX_NUVENS ou expandir o período.")
    exit()

print("\n" + "=" * 70)
print(f"📊 CALCULANDO VARIÂNCIA NDVI ({len(ndvi_paths)} datas)")
print("=" * 70)

# Carregar todos os NDVIs
ndvi_arrays = []
for path in ndvi_paths:
    with rasterio.open(path) as src:
        ndvi_arrays.append(src.read(1))
        profile = src.profile  # Guardar metadados

# Calcular variância pixel a pixel
ndvi_stack = np.stack(ndvi_arrays, axis=0)
variancia_ndvi = np.var(ndvi_stack, axis=0)

print(f"\nVariância NDVI:")
print(f"  Min: {np.min(variancia_ndvi):.4f}")
print(f"  Max: {np.max(variancia_ndvi):.4f}")
print(f"  Média: {np.mean(variancia_ndvi):.4f}")

# Salvar mapa de variância
variancia_path = os.path.join(PASTA_SAIDA, "variancia_ndvi.tif")
with rasterio.open(variancia_path, 'w', **profile) as dst:
    dst.write(variancia_ndvi.astype(np.float32), 1)

print(f"\n✅ Mapa de variância salvo: {variancia_path}")

print("\n" + "=" * 70)
print("✅ PROCESSAMENTO CONCLUÍDO!")
print("=" * 70)
print(f"\nArquivos gerados:")
for path in ndvi_paths:
    print(f"  • {path}")
print(f"  • {variancia_path}")

print(f"\n🎯 Próximo passo:")
print(f"   Executar script de vetorização para extrair polígonos")
print(f"   das áreas com variância > {VARIANCIA_NDVI_MINIMA}")
