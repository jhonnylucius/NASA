import requests
import os
import json

def coletar_imagens_ambientais(salvar_em):
    """
    Coleta metadados de imagens ambientais MODIS (NASA) e salva em JSON.
    """
    url = "https://modis.ornl.gov/rst/api/v1/"  # Exemplo: endpoint de metadados
    print("Coletando metadados de imagens ambientais MODIS...")
    resposta = requests.get(url)
    resposta.raise_for_status()
    dados = resposta.json()
    caminho = os.path.join(salvar_em, "imagens_ambientais.json")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    print(f"Salvo em {caminho}")

if __name__ == "__main__":
    pasta = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/raw_data/imagens_ambientais'))
    os.makedirs(pasta, exist_ok=True)
    coletar_imagens_ambientais(pasta)
