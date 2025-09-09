import requests
import datetime
import os
import json

def coletar_flora_fauna_50_anos(salvar_em):
    """
    Coleta observações de flora e fauna dos últimos 50 anos usando a API iNaturalist e salva em JSON.
    """
    hoje = datetime.date.today()
    inicio = hoje.replace(year=hoje.year - 50)
    url = "https://api.inaturalist.org/v1/observations"
    params = {
        "d1": inicio.strftime("%Y-%m-%d"),
        "d2": hoje.strftime("%Y-%m-%d"),
        "per_page": 200,
        "page": 1
    }
    todas_obs = []
    print(f"Coletando observações de {params['d1']} até {params['d2']}...")
    while True:
        resposta = requests.get(url, params=params)
        resposta.raise_for_status()
        dados = resposta.json()
        todas_obs.extend(dados.get("results", []))
        if not dados.get("results") or len(dados.get("results", [])) < params["per_page"]:
            break
        params["page"] += 1
        if params["page"] > 10:  # Limite de 10 páginas para evitar sobrecarga
            break
    caminho = os.path.join(salvar_em, f"flora_fauna_{params['d1']}_a_{params['d2']}.json")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(todas_obs, f, ensure_ascii=False, indent=2)
    print(f"Salvo em {caminho}")

if __name__ == "__main__":
    pasta = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/raw_data/flora_fauna'))
    os.makedirs(pasta, exist_ok=True)
    coletar_flora_fauna_50_anos(pasta)
