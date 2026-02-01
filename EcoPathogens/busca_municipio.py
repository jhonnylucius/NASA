import geopandas as gpd
from pystac_client import Client
import json

# --- CAMINHOS ---
arquivo_limites = r"C:\projtos pessoais\NASA\EcoPathogens\data\raw_data\limites-coromandel\limite_coromandel.geojson"

print("1. Lendo os limites da CIDADE INTEIRA...")
gdf_cidade = gpd.read_file(arquivo_limites)

# Pega o retângulo que cobre a cidade toda (BBOX Gigante)
bbox_cidade = list(gdf_cidade.total_bounds)
print(f"BBOX da Cidade: {bbox_cidade}")

print("\n2. Conectando no Satélite (ESA)...")
api_url = "https://catalogue.dataspace.copernicus.eu/stac"
client = Client.open(api_url)

print("3. Buscando imagens de JANEIRO/2020 sobre a cidade toda...")
search = client.search(
    collections=["SENTINEL-2"],
    bbox=bbox_cidade,
    datetime="2020-01-01/2020-01-30",
    max_items=5, # Traz só 5 pra não poluir a tela
    # Note: Tirei o filtro de nuvem. Quero ver se ele acha QUALQUER coisa.
)

items = search.item_collection()

print(f"\n--- RESULTADO FINAL ---")
print(f"Encontrei {len(items)} cenas de satélite cobrindo Coromandel.")

if len(items) > 0:
    print("SUCESSO! O sistema está funcionando.")
    for item in items:
        print(f"-> Data: {item.datetime} | ID: {item.id} | Nuvens: {item.properties['eo:cloud_cover']}%")
        # Mostra o link da imagem visual (thumbnail)
        print(f"   Link Visual: {item.assets['visual'].href}")
        print("-" * 30)
else:
    print("Zero resultados. Se isso acontecer, a API da ESA mudou algo drástico hoje.")