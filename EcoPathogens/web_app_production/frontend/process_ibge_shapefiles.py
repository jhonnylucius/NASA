"""
🗺️ Script para processar shapefiles do IBGE da Amazônia Legal
Converte arquivos .shp para GeoJSON para uso no mapa web

Arquivos do IBGE encontrados:
- Limites_Amazonia_Legal_2024.shp (shapefile principal)
- Limites_Amazonia_Legal_2024.dbf (base de dados)
- Limites_Amazonia_Legal_2024.prj (projeção)
- Limites_Amazonia_Legal_2024.shx (índice)
- Limites_Amazonia_Legal_2024.cpg (codificação)
"""

import os
import sys
import json
from pathlib import Path

def install_packages():
    """Instala pacotes necessários"""
    try:
        import geopandas
        import folium
        print("✅ Pacotes já instalados")
    except ImportError:
        print("📦 Instalando pacotes necessários...")
        os.system("pip install geopandas folium pyproj")
        print("✅ Pacotes instalados")

def process_ibge_shapefiles():
    """Processa os shapefiles do IBGE"""
    try:
        import geopandas as gpd
        
        print("🗺️ Processando shapefiles do IBGE...")
        
        # Caminho para os arquivos (ajuste conforme necessário)
        shapefile_path = Path("data/ibge/Limites_Amazonia_Legal_2024.shp")
        
        if not shapefile_path.exists():
            print("❌ Arquivo shapefile não encontrado")
            print(f"Procurado em: {shapefile_path.absolute()}")
            print("\n📁 Coloque os arquivos do IBGE em: data/ibge/")
            return False
        
        # Lê o shapefile
        gdf = gpd.read_file(shapefile_path)
        
        print(f"📊 Shapefile carregado: {len(gdf)} features")
        print(f"🗺️ CRS original: {gdf.crs}")
        
        # Converte para WGS84 (EPSG:4326) se necessário
        if gdf.crs != 'EPSG:4326':
            gdf = gdf.to_crs('EPSG:4326')
            print("🔄 Convertido para WGS84")
        
        # Converte para GeoJSON
        geojson_data = json.loads(gdf.to_json())
        
        # Salva o GeoJSON
        output_path = Path("public/data/amazonia_legal_ibge.geojson")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ GeoJSON salvo em: {output_path}")
        
        # Mostra informações dos dados
        print(f"\n📋 Informações dos dados:")
        if len(gdf.columns) > 0:
            print(f"   Colunas: {list(gdf.columns)}")
        
        bounds = gdf.bounds
        print(f"   Limites:")
        print(f"   - Norte: {bounds.maxy.max():.6f}")
        print(f"   - Sul: {bounds.miny.min():.6f}")
        print(f"   - Leste: {bounds.maxx.max():.6f}")
        print(f"   - Oeste: {bounds.minx.min():.6f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao processar shapefile: {e}")
        return False

def create_javascript_loader():
    """Cria um arquivo JavaScript para carregar os dados do IBGE"""
    
    js_code = """
// 🗺️ Carregador de dados IBGE da Amazônia Legal
// Carrega o GeoJSON processado dos shapefiles oficiais

class IBGEDataLoader {
    constructor() {
        this.amazoniaLegalData = null;
        this.isLoaded = false;
    }
    
    async loadAmazoniaLegal() {
        try {
            console.log('📊 Carregando dados oficiais IBGE...');
            
            const response = await fetch('data/amazonia_legal_ibge.geojson');
            if (!response.ok) {
                throw new Error('Erro ao carregar dados IBGE');
            }
            
            this.amazoniaLegalData = await response.json();
            this.isLoaded = true;
            
            console.log('✅ Dados IBGE carregados:', this.amazoniaLegalData.features.length, 'features');
            
            return this.amazoniaLegalData;
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados IBGE:', error);
            return null;
        }
    }
    
    addToMap(map) {
        if (!this.isLoaded || !this.amazoniaLegalData) {
            console.warn('Dados IBGE não carregados');
            return null;
        }
        
        const layer = L.geoJSON(this.amazoniaLegalData, {
            style: {
                color: '#228B22',
                fillColor: '#32CD32',
                fillOpacity: 0.2,
                weight: 3,
                dashArray: '8, 5'
            },
            onEachFeature: (feature, layer) => {
                const props = feature.properties;
                
                let popupContent = `
                    <div style="text-align: center; min-width: 250px;">
                        <h3>🏛️ Amazônia Legal</h3>
                        <p><strong>Dados Oficiais do IBGE</strong></p>
                        <hr>
                `;
                
                // Adiciona propriedades disponíveis
                for (const [key, value] of Object.entries(props)) {
                    if (value) {
                        popupContent += `<p><strong>${key}:</strong> ${value}</p>`;
                    }
                }
                
                popupContent += `
                        <hr>
                        <p><em>Instituto Brasileiro de Geografia e Estatística</em></p>
                    </div>
                `;
                
                layer.bindPopup(popupContent);
            }
        });
        
        layer.addTo(map);
        
        // Ajusta zoom para mostrar toda a área
        map.fitBounds(layer.getBounds());
        
        return layer;
    }
}

// Disponibiliza globalmente
window.IBGEDataLoader = IBGEDataLoader;

console.log('📊 IBGE Data Loader carregado');
"""
    
    output_path = Path("public/assets/js/ibge-loader.js")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_code)
    
    print(f"✅ JavaScript loader criado: {output_path}")

def main():
    print("🛰️ Processador de Shapefiles IBGE - Amazônia Legal")
    print("=" * 50)
    
    # Instala pacotes necessários
    install_packages()
    
    # Processa shapefiles
    success = process_ibge_shapefiles()
    
    if success:
        # Cria loader JavaScript
        create_javascript_loader()
        
        print("\n🎉 Processamento concluído!")
        print("\n📋 Próximos passos:")
        print("1. Adicione o script ibge-loader.js ao HTML")
        print("2. Use IBGEDataLoader no seu mapa")
        print("3. Os dados aparecerão como Google Earth + dados IBGE")
        
        print("\n💡 Exemplo de uso:")
        print("""
// No seu mapa JavaScript
const ibgeLoader = new IBGEDataLoader();
const data = await ibgeLoader.loadAmazoniaLegal();
if (data) {
    ibgeLoader.addToMap(map);
}
""")
    else:
        print("\n❌ Falha no processamento")
        print("\n📁 Verifique se os arquivos estão em:")
        print("   data/ibge/Limites_Amazonia_Legal_2024.shp")
        print("   data/ibge/Limites_Amazonia_Legal_2024.dbf")
        print("   data/ibge/Limites_Amazonia_Legal_2024.prj")
        print("   data/ibge/Limites_Amazonia_Legal_2024.shx")
        print("   data/ibge/Limites_Amazonia_Legal_2024.cpg")

if __name__ == "__main__":
    main()
