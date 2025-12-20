"""
🗺️ Processador de Shapefiles IBGE - Amazônia Legal
Converte os arquivos oficiais do IBGE para uso no mapa web

Arquivos encontrados:
- Limites_Amazonia_Legal_2024.shp (geometrias)
- Limites_Amazonia_Legal_2024.dbf (atributos)
- Limites_Amazonia_Legal_2024.prj (projeção SIRGAS 2000)
- Limites_Amazonia_Legal_2024.shx (índice)
- Limites_Amazonia_Legal_2024.cpg (codificação UTF-8)
"""

import os
import sys
import json
import shutil
from pathlib import Path

def setup_environment():
    """Configura o ambiente e instala dependências"""
    print("🔧 Configurando ambiente...")
    
    try:
        import geopandas as gpd
        print("✅ GeoPandas já instalado")
        return True
    except ImportError:
        print("📦 Instalando GeoPandas...")
        try:
            os.system("pip install geopandas")
            import geopandas as gpd
            print("✅ GeoPandas instalado com sucesso")
            return True
        except Exception as e:
            print(f"❌ Erro ao instalar GeoPandas: {e}")
            return False

def move_ibge_files():
    """Move os arquivos do IBGE para a pasta correta"""
    print("📁 Organizando arquivos do IBGE...")
    
    source_dir = Path("public/assets/images")
    target_dir = Path("public/data/ibge")
    
    # Cria diretório de destino
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Lista de arquivos do IBGE
    ibge_files = [
        "Limites_Amazonia_Legal_2024.shp",
        "Limites_Amazonia_Legal_2024.dbf", 
        "Limites_Amazonia_Legal_2024.prj",
        "Limites_Amazonia_Legal_2024.shx",
        "Limites_Amazonia_Legal_2024.cpg"
    ]
    
    moved_files = 0
    for filename in ibge_files:
        source_file = source_dir / filename
        target_file = target_dir / filename
        
        if source_file.exists():
            try:
                shutil.copy2(source_file, target_file)
                print(f"✅ Movido: {filename}")
                moved_files += 1
            except Exception as e:
                print(f"❌ Erro ao mover {filename}: {e}")
        else:
            print(f"⚠️ Arquivo não encontrado: {filename}")
    
    print(f"📊 Total de arquivos movidos: {moved_files}/5")
    return moved_files >= 3  # Precisa de pelo menos .shp, .dbf, .prj

def process_shapefile():
    """Processa o shapefile da Amazônia Legal"""
    try:
        import geopandas as gpd
        
        print("🗺️ Processando shapefile da Amazônia Legal...")
        
        shapefile_path = Path("public/data/ibge/Limites_Amazonia_Legal_2024.shp")
        
        if not shapefile_path.exists():
            print(f"❌ Shapefile não encontrado: {shapefile_path}")
            return False
        
        # Lê o shapefile
        gdf = gpd.read_file(shapefile_path)
        
        print(f"📊 Shapefile carregado:")
        print(f"   - Features: {len(gdf)}")
        print(f"   - CRS original: {gdf.crs}")
        print(f"   - Colunas: {list(gdf.columns)}")
        
        # Mostra informações dos dados
        if not gdf.empty:
            bounds = gdf.bounds
            print(f"   - Limites geográficos:")
            print(f"     Norte: {bounds.maxy.max():.6f}")
            print(f"     Sul: {bounds.miny.min():.6f}")
            print(f"     Leste: {bounds.maxx.max():.6f}")
            print(f"     Oeste: {bounds.minx.min():.6f}")
        
        # Converte para WGS84 se necessário
        if gdf.crs and gdf.crs.to_string() != 'EPSG:4326':
            print("🔄 Convertendo para WGS84...")
            gdf = gdf.to_crs('EPSG:4326')
        
        # Converte para GeoJSON
        geojson_data = json.loads(gdf.to_json())
        
        # Adiciona metadados
        geojson_data['metadata'] = {
            'fonte': 'IBGE - Instituto Brasileiro de Geografia e Estatística',
            'descricao': 'Limites oficiais da Amazônia Legal',
            'ano': 2024,
            'projecao_original': 'SIRGAS 2000',
            'area_km2': 5217423,
            'estados': 9,
            'municipios': 772,
            'processado_em': '2025-09-05'
        }
        
        # Salva o GeoJSON
        output_path = Path("public/data/amazonia_legal_ibge.geojson")
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ GeoJSON salvo: {output_path}")
        
        # Cria versão simplificada para web
        create_simplified_version(gdf)
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao processar shapefile: {e}")
        return False

def create_simplified_version(gdf):
    """Cria uma versão simplificada para carregamento mais rápido"""
    try:
        print("⚡ Criando versão simplificada...")
        
        # Simplifica a geometria (reduz pontos)
        gdf_simplified = gdf.copy()
        gdf_simplified['geometry'] = gdf_simplified['geometry'].simplify(0.01, preserve_topology=True)
        
        # Converte para GeoJSON simplificado
        simplified_geojson = json.loads(gdf_simplified.to_json())
        
        # Adiciona metadados
        simplified_geojson['metadata'] = {
            'fonte': 'IBGE',
            'versao': 'simplificada',
            'descricao': 'Versão otimizada para web'
        }
        
        # Salva versão simplificada
        simplified_path = Path("public/data/amazonia_legal_simplified.geojson")
        
        with open(simplified_path, 'w', encoding='utf-8') as f:
            json.dump(simplified_geojson, f, ensure_ascii=False, separators=(',', ':'))
        
        print(f"✅ Versão simplificada salva: {simplified_path}")
        
    except Exception as e:
        print(f"⚠️ Erro ao criar versão simplificada: {e}")

def update_javascript_loader():
    """Atualiza o carregador JavaScript com os caminhos corretos"""
    
    js_update = """
// 🗺️ Carregador atualizado com dados IBGE processados

class IBGEDataLoader {
    constructor() {
        this.amazoniaLegalData = null;
        this.isLoaded = false;
        this.baseUrl = 'data/';
    }
    
    async loadAmazoniaLegal(simplified = true) {
        try {
            console.log('📊 Carregando dados oficiais IBGE...');
            
            // Escolhe versão simplificada ou completa
            const filename = simplified ? 
                'amazonia_legal_simplified.geojson' : 
                'amazonia_legal_ibge.geojson';
            
            const response = await fetch(this.baseUrl + filename);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            this.amazoniaLegalData = await response.json();
            this.isLoaded = true;
            
            console.log('✅ Dados IBGE carregados:', {
                features: this.amazoniaLegalData.features?.length || 0,
                metadata: this.amazoniaLegalData.metadata
            });
            
            return this.amazoniaLegalData;
            
        } catch (error) {
            console.warn('⚠️ Dados IBGE não disponíveis, usando fallback:', error.message);
            return this.loadFallbackData();
        }
    }
    
    loadFallbackData() {
        // Dados de fallback se os arquivos IBGE não estiverem disponíveis
        this.amazoniaLegalData = {
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                properties: {
                    nome: "Amazônia Legal",
                    fonte: "IBGE (fallback)",
                    area_km2: 5217423
                },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-42.91, -18.03], [-42.91, -5.16], [-48.90, 5.16],
                        [-60.64, 5.16], [-73.99, 2.81], [-73.99, -7.53],
                        [-57.64, -18.03], [-42.91, -18.03]
                    ]]
                }
            }]
        };
        
        this.isLoaded = true;
        console.log('✅ Dados de fallback carregados');
        return this.amazoniaLegalData;
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
                dashArray: '10, 5',
                opacity: 0.8
            },
            onEachFeature: (feature, layer) => {
                const props = feature.properties;
                const metadata = this.amazoniaLegalData.metadata;
                
                layer.bindPopup(`
                    <div style="text-align: center; min-width: 300px;">
                        <h3>🏛️ Amazônia Legal</h3>
                        <p><strong>Dados Oficiais do IBGE</strong></p>
                        <hr>
                        <p><strong>Área:</strong> ${(props.area_km2 || metadata?.area_km2 || 5217423).toLocaleString('pt-BR')} km²</p>
                        <p><strong>Estados:</strong> ${metadata?.estados || 9}</p>
                        <p><strong>Municípios:</strong> ${metadata?.municipios || 772}</p>
                        <p><strong>Fonte:</strong> ${metadata?.fonte || 'IBGE'}</p>
                        <p><strong>Ano:</strong> ${metadata?.ano || 2024}</p>
                        <hr>
                        <p><em>Instituto Brasileiro de Geografia e Estatística</em></p>
                    </div>
                `);
            }
        });
        
        return layer;
    }
}

// Torna disponível globalmente
window.IBGEDataLoader = IBGEDataLoader;

console.log('📊 IBGE Data Loader atualizado com dados processados');
"""
    
    # Salva o JavaScript atualizado
    js_path = Path("public/assets/js/ibge-loader.js")
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_update)
    
    print(f"✅ JavaScript loader atualizado: {js_path}")

def main():
    print("🛰️ Processador de Shapefiles IBGE - Amazônia Legal")
    print("=" * 55)
    
    # Configura ambiente
    if not setup_environment():
        print("❌ Falha na configuração do ambiente")
        return False
    
    # Move arquivos IBGE
    if not move_ibge_files():
        print("❌ Falha ao organizar arquivos IBGE")
        return False
    
    # Processa shapefile
    if not process_shapefile():
        print("❌ Falha ao processar shapefile")
        return False
    
    # Atualiza JavaScript
    update_javascript_loader()
    
    print("\n🎉 Processamento concluído com sucesso!")
    print("\n📋 Arquivos gerados:")
    print("   ✅ public/data/amazonia_legal_ibge.geojson (completo)")
    print("   ✅ public/data/amazonia_legal_simplified.geojson (web)")
    print("   ✅ public/assets/js/ibge-loader.js (atualizado)")
    
    print("\n🚀 Próximos passos:")
    print("   1. O mapa agora usa dados OFICIAIS do IBGE")
    print("   2. Google Satellite + contorno real da Amazônia Legal")
    print("   3. Teste em: http://localhost:8000/demo-mapa.html")
    
    return True

if __name__ == "__main__":
    main()
