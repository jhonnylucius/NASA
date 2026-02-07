"""
🗺️ VISUALIZADOR DE FAZENDAS - COROMANDEL
=========================================
Cria um mapa HTML interativo para visualizar as plantações detectadas.
"""

import geopandas as gpd
import folium
from folium import plugins
import os

# ========== CONFIGURAÇÕES ==========
arquivo_entrada = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\fazendas_monitoramento_filtrado.geojson"
arquivo_saida_html = r"C:\projtos pessoais\NASA\EcoPathogens\data\processed_data\mapa_fazendas_coromandel.html"

# Cores por tipo de cultura
CORES_CULTURAS = {
    "Soja": "#FFD700",           # Amarelo ouro
    "Cana-de-açúcar": "#00FF00",  # Verde limão
    "Café": "#8B4513",            # Marrom café
    "Citrus": "#FFA500",          # Laranja
    "Arroz": "#87CEEB",           # Azul claro
    "Algodão": "#FFFFFF",         # Branco
    "Outras Lavouras Perenes": "#9370DB"  # Roxo
}

print("=" * 60)
print("🗺️ GERANDO MAPA INTERATIVO")
print("=" * 60)

# Verificar se arquivo existe
if not os.path.exists(arquivo_entrada):
    print(f"\n❌ ERRO: Arquivo não encontrado!")
    print(f"   Execute primeiro: filtrar_lavouras_avancado.py")
    print(f"   Esperado em: {arquivo_entrada}")
    exit()

# Carregar dados
print("\n1️⃣ Carregando fazendas detectadas...")
gdf = gpd.read_file(arquivo_entrada)

if len(gdf) == 0:
    print("❌ ERRO: Arquivo vazio! Nenhuma fazenda foi detectada.")
    exit()

print(f"✅ {len(gdf)} fazendas carregadas")

# Calcular centro do mapa (média das coordenadas)
centro_lat = gdf.geometry.centroid.y.mean()
centro_lon = gdf.geometry.centroid.x.mean()

print(f"\n2️⃣ Criando mapa centrado em: {centro_lat:.4f}, {centro_lon:.4f}")

# Criar mapa base
mapa = folium.Map(
    location=[centro_lat, centro_lon],
    zoom_start=11,
    tiles="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr="Esri"
)

# Adicionar camada de satélite alternativa
folium.TileLayer(
    'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attr='Google Satellite',
    name='Google Satellite',
    overlay=False,
    control=True
).add_to(mapa)

# Adicionar camada de ruas para referência
folium.TileLayer(
    'OpenStreetMap',
    name='Ruas (OpenStreetMap)',
    overlay=False,
    control=True
).add_to(mapa)

print("3️⃣ Adicionando fazendas ao mapa...")

# Adicionar cada fazenda
for idx, row in gdf.iterrows():
    cultura = row.get('tipo_cultura', 'Desconhecido')
    area_ha = row.get('area_hectares', 0)
    compacidade = row.get('compacidade', 0)
    
    # Cor baseada na cultura
    cor = CORES_CULTURAS.get(cultura, "#808080")
    
    # Popup com informações
    popup_html = f"""
    <div style="font-family: Arial; min-width: 200px;">
        <h4 style="margin: 0 0 10px 0; color: {cor};">🌾 {cultura}</h4>
        <hr style="margin: 5px 0;">
        <p><strong>📏 Área:</strong> {area_ha:.2f} hectares</p>
        <p><strong>📐 Compacidade:</strong> {compacidade:.2f}</p>
        <p><strong>🆔 ID:</strong> {idx}</p>
    </div>
    """
    
    # Adicionar polígono ao mapa
    folium.GeoJson(
        row.geometry,
        style_function=lambda x, cor=cor: {
            'fillColor': cor,
            'color': 'white',
            'weight': 2,
            'fillOpacity': 0.6
        },
        popup=folium.Popup(popup_html, max_width=300)
    ).add_to(mapa)

# Adicionar legenda
legenda_html = """
<div style="
    position: fixed; 
    bottom: 50px; 
    left: 50px; 
    width: 220px; 
    background-color: white; 
    border: 2px solid grey; 
    z-index: 9999; 
    font-size: 14px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
">
    <h4 style="margin: 0 0 10px 0;">🌾 Culturas Detectadas</h4>
    <hr style="margin: 5px 0;">
"""

# Adicionar cada cultura encontrada
for cultura in gdf['tipo_cultura'].unique():
    count = len(gdf[gdf['tipo_cultura'] == cultura])
    area_total = gdf[gdf['tipo_cultura'] == cultura]['area_hectares'].sum()
    cor = CORES_CULTURAS.get(cultura, "#808080")
    
    legenda_html += f"""
    <div style="margin: 5px 0;">
        <span style="
            display: inline-block; 
            width: 15px; 
            height: 15px; 
            background-color: {cor}; 
            border: 1px solid black;
            margin-right: 5px;
        "></span>
        <strong>{cultura}</strong><br>
        <span style="margin-left: 20px; font-size: 12px; color: #666;">
            {count} áreas • {area_total:.1f} ha
        </span>
    </div>
    """

legenda_html += """
    <hr style="margin: 10px 0 5px 0;">
    <div style="font-size: 12px; color: #666;">
        <strong>Total:</strong> """ + f"{len(gdf)} fazendas" + """
    </div>
</div>
"""

mapa.get_root().html.add_child(folium.Element(legenda_html))

# Adicionar controle de camadas
folium.LayerControl().add_to(mapa)

# Adicionar medidor de escala
plugins.MeasureControl(
    position='topleft',
    primary_length_unit='meters',
    secondary_length_unit='kilometers',
    primary_area_unit='hectares'
).add_to(mapa)

# Adicionar plugin de tela cheia
plugins.Fullscreen(
    position='topright',
    title='Tela Cheia',
    title_cancel='Sair da Tela Cheia'
).add_to(mapa)

# Salvar mapa
print(f"\n4️⃣ Salvando mapa HTML...")
mapa.save(arquivo_saida_html)

print("\n" + "=" * 60)
print("✅ MAPA GERADO COM SUCESSO!")
print("=" * 60)
print(f"\nArquivo salvo em:")
print(f"  {arquivo_saida_html}")
print("\nAbra no navegador para visualizar!")
print("\n📊 Resumo:")
print(f"  • Total de fazendas: {len(gdf)}")
print(f"  • Área total: {gdf['area_hectares'].sum():.2f} hectares")
print(f"  • Culturas diferentes: {len(gdf['tipo_cultura'].unique())}")
print("=" * 60)
