import requests
import os
import json

def coletar_alertas_epidemias(salvar_em):
    """
    Coleta alertas de epidemias em tempo real do HealthMap e salva em JSON.
    """
    url = "https://www.healthmap.org/hlifedata/service/getEvents.php"
    params = {"format": "json"}
    print("Coletando alertas de epidemias em tempo real...")
    resposta = requests.get(url, params=params)
    resposta.raise_for_status()
    dados = resposta.json()
    caminho = os.path.join(salvar_em, "alertas_epidemias.json")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    print(f"Salvo em {caminho}")

if __name__ == "__main__":
    pasta = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/raw_data/alertas_epidemias'))
    os.makedirs(pasta, exist_ok=True)
    coletar_alertas_epidemias(pasta)
