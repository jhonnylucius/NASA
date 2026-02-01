import geopandas as gpd
from pystac_client import Client
import json

# --- SUAS CREDENCIAIS COPERNICUS (Aquelas do cadastro) ---
# Se não colocar isso, não vai achar nada!
USER_EMAIL = "contato@union.dev.br"
USER_PASS = ",M$,Z#nZPucu_d7"

# --- CAMINHOS ---
arquivo_fazendas = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\fazendas_monitoramento.geojson"

print("1. Procurando a maior fazenda de Coromandel no seu arquivo...")
gdf = gpd.read_file(arquivo_fazendas)

# Calcula a área (em graus quadrados mesmo, só pra comparar) e pega a maior
gdf['area'] = gdf.geometry.area
maior_fazenda = gdf.sort_values('area', ascending=False).iloc[0]

print(f"-> Achei! A maior lavoura tem ID interno: {maior_fazenda.name}")
print(f"-> Tipo de cultura (Código): {maior_fazenda['tipo_plantio']}")

# Pega o 'Bounding Box' (o quadrado em volta da fazenda) para pesquisar
bbox = maior_fazenda.geometry.bounds # (minx, miny, maxx, maxy)

print("\n2. Conectando no Satélite Sentinel-2...")
# URL pública do catálogo STAC (não precisa de senha pra PESQUISAR, só pra baixar)
api_url = "https://catalogue.dataspace.copernicus.eu/stac"
client = Client.open(api_url)

print("3. Buscando imagens dos últimos 365 dias com pouca nuvem...")
search = client.search(
    collections=["SENTINEL-2"],
    bbox=bbox,
    datetime="2025-01-01/2026-02-01", # Janeirão chuvoso
    query={"eo:cloud_cover": {"lt": 90}} # Aceita até 90% de nuvem pq janeiro chove muito
)

items = search.item_collection()

if len(items) > 0:
    print(f"\nSUCESSO! Encontrei {len(items)} passagens do satélite sobre essa fazenda.")
    
    # Mostra as 3 mais recentes
    for item in list(items)[:3]:
        data = item.datetime.strftime("%d/%m/%Y")
        nuvens = item.properties['eo:cloud_cover']
        print(f" - Data: {data} | Nuvens: {nuvens:.1f}% | ID: {item.id}")
        
    print("\nPróximo passo: Calcular o NDVI (Saúde) dessa imagem!")
else:
    print("\nNenhuma imagem encontrada. Pode ser excesso de nuvens (tente aumentar o limite) ou data.")