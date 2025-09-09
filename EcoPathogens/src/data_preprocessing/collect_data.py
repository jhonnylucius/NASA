# src/data_preprocessing/collect_data.py

# 1. Importar as bibliotecas que vamos usar
import requests
import os
import json


# 2. Definir a URL base da API da NASA para clima de Marte.
API_URL = "https://api.nasa.gov/insight_weather/"
API_KEY = "DEMO_KEY"  # Troque por sua chave se tiver

# 3. Criar uma função para baixar os dados
def get_mars_weather_data():
    """
    Coleta dados de clima de Marte dos últimos 50 anos (se disponível na API).
    A API InSight só tem dados desde 2018, mas o script já fica pronto para outros endpoints.
    """
    import datetime
    hoje = datetime.date.today()
    inicio = hoje.replace(year=hoje.year - 50)
    anos = range(inicio.year, hoje.year + 1)
    todos_dados = {}
    for ano in anos:
        print(f"Coletando dados de Marte para o ano {ano}...")
        # A API InSight não aceita filtro por ano, mas mantemos a estrutura para outros endpoints
        params = {
            "api_key": API_KEY,
            "feedtype": "json",
            "ver": "1.0"
        }
        try:
            response = requests.get(API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            todos_dados[str(ano)] = data
        except requests.exceptions.RequestException as e:
            print(f"Erro ao coletar ano {ano}: {e}")
    print("Coleta finalizada.")
    return todos_dados

# 4. Criar uma função para salvar os dados em um arquivo
def save_data_to_file(data, filename):
    """
    Salva os dados em arquivos separados por ano na pasta 'data/raw_data'.
    """
    script_directory = os.path.dirname(os.path.abspath(__file__))
    folder_path = os.path.join(script_directory, '..', 'data', 'raw_data')
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    for ano, dados_ano in data.items():
        file_path = os.path.join(folder_path, f"mars_weather_{ano}.json")
        with open(file_path, 'w') as file:
            json.dump(dados_ano, file, indent=4)
        print(f"Dados salvos com sucesso em: {file_path}")

# Bloco principal para executar as funções ao rodar o script
if __name__ == "__main__":
    dados = get_mars_weather_data()
    if dados:
        save_data_to_file(dados, "mars_weather.json")