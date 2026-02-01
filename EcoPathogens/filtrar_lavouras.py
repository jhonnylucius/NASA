import geopandas as gpd
import rasterio
from rasterio.mask import mask
from rasterio.features import shapes
import os
import numpy as np

# --- CONFIGURAÇÃO EXATA DOS SEUS CAMINHOS ---
caminho_geojson = r"C:\projtos pessoais\NASA\EcoPathogens\data\raw_data\limites-coromandel\limite_coromandel.geojson"
caminho_tif = r"C:\projtos pessoais\NASA\EcoPathogens\data\raw_data\brazil_coverage_2024.tif"
caminho_saida = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\fazendas_monitoramento.geojson"

# Criar a pasta de saída (processed_data) se não existir
os.makedirs(os.path.dirname(caminho_saida), exist_ok=True)

print("--- INICIANDO O PROCESSAMENTO ---")

# 1. Carregar GeoJSON
print(f"1. Lendo limites de: {caminho_geojson}")
if not os.path.exists(caminho_geojson):
    print("ERRO: O arquivo limite_coromandel.geojson não foi encontrado!")
    exit()
    
limite_municipio = gpd.read_file(caminho_geojson)
geometria = limite_municipio.geometry.values

# 2. Abrir TIF
print(f"2. Abrindo Mapa Brasil 2024: {caminho_tif}")
if not os.path.exists(caminho_tif):
    print("ERRO: O arquivo brazil_coverage_2024.tif não está na pasta!")
    exit()

with rasterio.open(caminho_tif) as src:
    print("3. Recortando a área de Coromandel (Aguarde, processando gigabytes)...")
    try:
        imagem_recortada, transformacao = mask(src, geometria, crop=True)
    except Exception as e:
        print(f"Erro ao recortar: {e}")
        exit()
    
    dados_imagem = imagem_recortada[0] 

    print("4. Filtrando Soja (39), Cana (20), Café (46) e Lavoura Temp. (19)...")
    ids_agricultura = [39, 19, 20, 46, 41]
    
    # Cria a máscara booleana
    mascara_plantio = np.isin(dados_imagem, ids_agricultura)

    print("5. Vetorizando (Transformando pixels em polígonos)...")
    resultados = (
        {'properties': {'tipo_plantio': int(v)}, 'geometry': s}
        for i, (s, v) in enumerate(
            shapes(dados_imagem, mask=mascara_plantio, transform=transformacao)
        )
    )
    
    geometrias_finais = list(resultados)

if not geometrias_finais:
    print("AVISO: Nenhuma área de agricultura encontrada dentro desse limite.")
else:
    print(f"SUCESSO! Encontramos {len(geometrias_finais)} áreas de plantio.")
    
    # Salvar
    gdf_fazendas = gpd.GeoDataFrame.from_features(geometrias_finais)
    gdf_fazendas.set_crs(epsg=4326, inplace=True) # Define GPS padrão
    gdf_fazendas.to_file(caminho_saida, driver='GeoJSON')
    
    print(f"6. Arquivo salvo em: {caminho_saida}")
    print("--- FIM ---")