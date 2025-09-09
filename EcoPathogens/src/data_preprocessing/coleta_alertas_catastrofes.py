import requests
import os
import json

def coletar_alertas_catastrofes(salvar_em):
    """
    Coleta alertas de catástrofes naturais do Copernicus Emergency e salva em JSON ou texto bruto.
    """
    url = "https://emergency.copernicus.eu/mapping/list-of-activations-advanced.json"
    print("Coletando alertas de catástrofes naturais...")
    resposta = requests.get(url)
    resposta.raise_for_status()
    content_type = resposta.headers.get('Content-Type', '')
    caminho = os.path.join(salvar_em, "alertas_catastrofes.json")
    try:
        if 'application/json' in content_type:
            dados = resposta.json()
            with open(caminho, "w", encoding="utf-8") as f:
                json.dump(dados, f, ensure_ascii=False, indent=2)
            print(f"Salvo em {caminho}")
        else:
            # Salva o conteúdo bruto para análise
            caminho_txt = os.path.join(salvar_em, "alertas_catastrofes_raw.txt")
            with open(caminho_txt, "w", encoding="utf-8") as f:
                f.write(resposta.text)
            print(f"Resposta não é JSON. Conteúdo salvo em {caminho_txt}")
    except Exception as e:
        print(f"Erro ao processar resposta: {e}")
        caminho_txt = os.path.join(salvar_em, "alertas_catastrofes_raw.txt")
        with open(caminho_txt, "w", encoding="utf-8") as f:
            f.write(resposta.text)
        print(f"Conteúdo bruto salvo em {caminho_txt}")

if __name__ == "__main__":
    pasta = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/raw_data/alertas_catastrofes'))
    os.makedirs(pasta, exist_ok=True)
    coletar_alertas_catastrofes(pasta)
