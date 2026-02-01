import geopandas as gpd
import folium

# Caminho do arquivo que acabamos de gerar
arquivo_fazendas = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\fazendas_monitoramento.geojson"

print("1. Carregando as 12 mil fazendas (pode demorar uns segundos)...")
gdf = gpd.read_file(arquivo_fazendas)

# Vamos pegar o centro do mapa automaticamente
centro_lat = gdf.geometry.centroid.y.mean()
centro_lon = gdf.geometry.centroid.x.mean()

print(f"2. Gerando mapa centrado em: {centro_lat}, {centro_lon}")
# Cria o mapa base
m = folium.Map(location=[centro_lat, centro_lon], zoom_start=11, tiles="CartoDB positron")

# DICA DE PERFORMANCE: Como são 12k, vamos desenhar só os contornos (style_function)
# para não pesar tanto o navegador.
folium.GeoJson(
    gdf,
    name="Lavouras",
    style_function=lambda x: {
        'fillColor': '#ffae00', # Amarelo Ouro (Soja/Milho)
        'color': '#ffae00',
        'weight': 1,
        'fillOpacity': 0.5
    },
    tooltip=folium.GeoJsonTooltip(fields=['tipo_plantio'], aliases=['Código Crop:'])
).add_to(m)

# Salva
saida_html = "mapa_fazendas.html"
m.save(saida_html)

print(f"3. PRONTO! Abra o arquivo '{saida_html}' no seu navegador.")