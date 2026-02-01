import geopandas as gpd
from pystac_client import Client

# --- CAMINHOS ---
arquivo_fazendas = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\fazendas_monitoramento.geojson"

print("1. Lendo arquivo...")
gdf = gpd.read_file(arquivo_fazendas)

# Pegando a maior fazenda (sem calcular área pra não dar erro, pegando pelo tamanho do poligono bruto)
# Vamos pegar a primeira que for soja (39)
fazenda = gdf[gdf['tipo_plantio'] == 39].iloc[0]

# --- O PULO DO GATO: AS COORDENADAS ---
bbox = fazenda.geometry.bounds # Retorna (minx, miny, maxx, maxy)
print(f"\n--- DIAGNÓSTICO ---")
print(f"ID da Fazenda: {fazenda.name}")
print(f"BBOX Original (GeoPandas): {bbox}")
# O formato deve ser: (Longitude Oeste, Latitude Sul, Longitude Leste, Latitude Norte)
# Exemplo Coromandel: (-47.xxxx, -18.xxxx, -47.xxxx, -18.xxxx)

if bbox[0] > 0 or bbox[1] > 0:
    print("ERRO DETECTADO: As coordenadas parecem positivas. O Brasil fica no hemisfério Sul e Oeste (Negativo)!")
else:
    print("Coordenadas parecem corretas (Negativas).")

print("\n2. Tentando busca DIRETA sem filtros...")
api_url = "https://catalogue.dataspace.copernicus.eu/stac"
client = Client.open(api_url)

# Busca bruta - Aumentei o range e tirei filtro de nuvem
search = client.search(
    collections=["SENTINEL-2"],
    bbox=bbox, 
    datetime="2025-06-01/2026-02-01" 
)

print(f"Encontrados: {len(search.item_collection())}")