import requests
import datetime
import os
import json

def coletar_terremotos_50_anos(salvar_em):
    """
    Coleta dados de terremotos dos últimos 50 anos usando a API USGS, dividindo em intervalos de 10 anos e paginando.
    """
    hoje = datetime.date.today()
    inicio = hoje.replace(year=hoje.year - 50)
    url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    intervalo_anos = 10
    data_atual = inicio
    while data_atual < hoje:
        data_fim = data_atual.replace(year=min(data_atual.year + intervalo_anos, hoje.year))
        if data_fim > hoje:
            data_fim = hoje
        print(f"Coletando terremotos de {data_atual} até {data_fim}...")
        eventos = []
        limit = 20000
        offset = 1
        while True:
            params = {
                "format": "geojson",
                "starttime": data_atual.strftime("%Y-%m-%d"),
                "endtime": data_fim.strftime("%Y-%m-%d"),
                "limit": limit,
                "offset": offset
            }
            try:
                resposta = requests.get(url, params=params, timeout=60)
                resposta.raise_for_status()
            except Exception as e:
                print(f"Erro ao coletar: {e}. Pulando intervalo.")
                break
            dados = resposta.json()
            eventos.extend(dados.get("features", []))
            if len(dados.get("features", [])) < limit:
                break
            offset += limit
        caminho = os.path.join(salvar_em, f"terremotos_{data_atual}_a_{data_fim}.json")
        with open(caminho, "w", encoding="utf-8") as f:
            json.dump(eventos, f, ensure_ascii=False, indent=2)
        print(f"Salvo em {caminho} ({len(eventos)} eventos)")
        data_atual = data_fim

if __name__ == "__main__":
    pasta = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/raw_data/terremotos'))
    os.makedirs(pasta, exist_ok=True)
    coletar_terremotos_50_anos(pasta)
