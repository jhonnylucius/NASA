import requests
import os
import json

def coletar_dados_oceanicos(salvar_em):
    """
    Coleta dados históricos oceânicos do WOD (NOAA) e salva em JSON.
    """
    url = "https://www.nodc.noaa.gov/OC5/woa18/woa18data.html"  # Página de dados, não API direta
    print("Atenção: O WOD não possui API REST direta para coleta automatizada. Baixe manualmente se necessário.")
    dados = {"mensagem": "Acesse e baixe manualmente os dados em https://www.nodc.noaa.gov/OC5/woa18/woa18data.html"}
    caminho = os.path.join(salvar_em, "dados_oceanicos.json")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    print(f"Mensagem salva em {caminho}")

if __name__ == "__main__":
    pasta = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/raw_data/dados_oceanicos'))
    os.makedirs(pasta, exist_ok=True)
    coletar_dados_oceanicos(pasta)
