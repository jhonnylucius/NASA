import requests
import datetime
import os
import json

def coletar_especies_globais_50_anos(salvar_em):
    """
    Coleta dados de espécies globais dos últimos 50 anos usando a API GBIF e salva em JSON.
    """
    hoje = datetime.date.today()
    inicio = hoje.replace(year=hoje.year - 50)
    url = "https://api.gbif.org/v1/occurrence/search"
    params = {
        "eventDate": f"{inicio.strftime('%Y-%m-%d')},{hoje.strftime('%Y-%m-%d')}",
        "limit": 300,
        "offset": 0
    }
    todas_obs = []
    print(f"Coletando espécies globais de {inicio} até {hoje}...")
    for _ in range(10):  # Limite de 10 páginas para evitar sobrecarga
        resposta = requests.get(url, params=params)
        resposta.raise_for_status()
        dados = resposta.json()
        todas_obs.extend(dados.get("results", []))
        if not dados.get("results") or len(dados.get("results", [])) < params["limit"]:
            break
        params["offset"] += params["limit"]
    caminho = os.path.join(salvar_em, f"especies_globais_{inicio}_a_{hoje}.json")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(todas_obs, f, ensure_ascii=False, indent=2)
    print(f"Salvo em {caminho}")

if __name__ == "__main__":
    pasta = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/raw_data/especies_globais'))
    os.makedirs(pasta, exist_ok=True)
    coletar_especies_globais_50_anos(pasta)
