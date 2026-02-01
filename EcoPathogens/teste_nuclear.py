import requests
import json

# --- CONFIGURAÇÃO ---
# Área de Coromandel (BBOX)
BBOX = [-47.434923, -18.761974, -46.797872, -17.924733]
# Intervalo de tempo (Janeiro 2024 - Passado Real)
INTERVALO = "2024-01-01T00:00:00Z/2024-01-30T23:59:59Z"

print("--- PASSO 1: Descobrindo o NOME EXATO da coleção ---")
url_col = "https://catalogue.dataspace.copernicus.eu/stac/collections"
try:
    resp = requests.get(url_col)
    collections = resp.json().get('collections', [])
    
    print(f"O servidor possui {len(collections)} coleções disponíveis.")
    
    # Vamos achar a do Sentinel-2
    id_correto = None
    for col in collections:
        cid = col['id']
        # Procura algo que pareça com sentinel-2 nivel 2A
        if "sentinel-2" in cid.lower() and "l2a" in cid.lower():
            print(f"-> ENCONTRADO: '{cid}' (Título: {col.get('title')})")
            id_correto = cid
            break
            
    if not id_correto:
        print("AVISO: Não achei 'l2a' específico, tentando 'sentinel-2' genérico...")
        for col in collections:
            if "sentinel-2" in col['id'].lower():
                id_correto = col['id']
                print(f"-> ENCONTRADO: '{id_correto}'")
                break

except Exception as e:
    print(f"Erro ao listar coleções: {e}")
    exit()

if not id_correto:
    print("ERRO CRÍTICO: O servidor não listou nenhuma coleção Sentinel-2.")
    exit()

print(f"\n--- PASSO 2: Buscando na coleção '{id_correto}' ---")
url_search = "https://catalogue.dataspace.copernicus.eu/stac/search"

payload = {
    "collections": [id_correto], # Usa o ID que o próprio servidor nos disse
    "bbox": BBOX,
    "datetime": INTERVALO,
    "limit": 3
}

headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url_search, json=payload, headers=headers)
    dados = response.json()
    total = len(dados.get('features', []))
    
    print(f"Status HTTP: {response.status_code}")
    print(f"Cenas encontradas: {total}")
    
    if total > 0:
        print("\nSUCESSO! O SISTEMA ESTÁ VIVO! 🚀")
        cena = dados['features'][0]
        print(f"Exemplo de Imagem:")
        print(f"ID: {cena['id']}")
        print(f"Data: {cena['properties']['datetime']}")
        print(f"Cobertura de Nuvens: {cena['properties']['eo:cloud_cover']}%")
        if 'visual' in cena['assets']:
            print(f"Link Visual: {cena['assets']['visual']['href']}")
    else:
        print("Ainda zero. Isso é muito estranho. O BBOX pode estar invertido (Lat/Lon vs Lon/Lat).")

except Exception as e:
    print(f"Erro na busca: {e}")