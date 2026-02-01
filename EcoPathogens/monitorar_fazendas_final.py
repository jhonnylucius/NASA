import geopandas as gpd
import pandas as pd
from pystac_client import Client
import json
import os

# --- SUAS CONFIGURAÇÕES ---
ARQUIVO_FAZENDAS = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\fazendas_monitoramento.geojson"
ARQUIVO_SAIDA = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\relatorio_safra_2024.csv"

# Intervalo de tempo: Vamos olhar o passado (Jan 2024) para garantir que tem dados
DATA_BUSCA = "2024-01-01/2024-01-30"

print("--- INICIANDO SISTEMA DE MONITORAMENTO ---")

# 1. Carregar fazendas e pegar as maiores
print("1. Selecionando as 'Top 5' fazendas para monitorar...")
gdf = gpd.read_file(ARQUIVO_FAZENDAS)

# Calcula área aproximada para ordenar (graus quadrados servem para comparação)
gdf['area_calc'] = gdf.geometry.area
top_fazendas = gdf.sort_values('area_calc', ascending=False).head(5)

print(f"   -> Monitorando fazendas IDs: {list(top_fazendas.index)}")

# 2. Conectar na API (Agora com o nome certo!)
print("2. Conectando no Catálogo Copernicus...")
client = Client.open("https://catalogue.dataspace.copernicus.eu/stac")

# Lista para salvar os dados (Simulando seu Banco de Dados)
dados_banco = []

# 3. Loop por cada fazenda
for idx, row in top_fazendas.iterrows():
    id_fazenda = idx
    bbox = row.geometry.bounds # (minx, miny, maxx, maxy)
    
    print(f"\n--> Checando Fazenda {id_fazenda}...")
    
    # A BUSCA CORRETA (Com letra minúscula!)
    search = client.search(
        collections=["sentinel-2-l2a"], # O NOME MÁGICO
        bbox=bbox,
        datetime=DATA_BUSCA,
        query={"eo:cloud_cover": {"lt": 50}}, # Menos de 50% de nuvem
        max_items=3 # Pegar só as 3 melhores
    )
    
    items = search.item_collection()
    print(f"    Encontradas {len(items)} passagens do satélite.")
    
    if len(items) > 0:
        for item in items:
            # Extraindo dados úteis
            data_satelite = item.datetime.strftime("%Y-%m-%d %H:%M")
            nuvens = item.properties['eo:cloud_cover']
            link_visual = item.assets['visual'].href if 'visual' in item.assets else "N/A"
            
            # Adiciona na lista para salvar
            dados_banco.append({
                "fazenda_id": id_fazenda,
                "data_leitura": data_satelite,
                "cobertura_nuvens": round(nuvens, 2),
                "satelite_id": item.id,
                "imagem_preview": link_visual
            })
            print(f"    [SALVO] Data: {data_satelite} | Nuvens: {nuvens:.1f}%")

# 4. Salvar no CSV (Ou MySQL futuramente)
if dados_banco:
    df_resultado = pd.DataFrame(dados_banco)
    df_resultado.to_csv(ARQUIVO_SAIDA, index=False, sep=";")
    print(f"\n3. RELATÓRIO GERADO COM SUCESSO!")
    print(f"   Arquivo salvo em: {ARQUIVO_SAIDA}")
    print("   Abra esse Excel para ver os links das imagens!")
else:
    print("\nNenhuma imagem encontrada nos filtros definidos.")