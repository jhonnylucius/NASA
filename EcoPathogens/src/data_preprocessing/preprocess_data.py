# src/data_preprocessing/process_data.py

# 1. Importar as bibliotecas que vamos usar
import pandas as pd
import os
import json


# 2. Definir os caminhos para os arquivos
RAW_DATA_FOLDER = "../../data/raw_data"
PROCESSED_DATA_FOLDER = "../../data/processed_data"
PROCESSED_DATA_FILE = "mars_weather_clean.csv"

# 3. Função para ler, limpar e salvar os dados

def process_mars_weather_data():
    """
    Lê todos os arquivos de clima de Marte (um por ano), limpa, organiza e salva em um único CSV.
    """
    data_points = []
    # Percorre todos os arquivos que começam com 'mars_weather_'
    for fname in os.listdir(RAW_DATA_FOLDER):
        if fname.startswith('mars_weather_') and fname.endswith('.json'):
            raw_file_path = os.path.join(RAW_DATA_FOLDER, fname)
            try:
                with open(raw_file_path, 'r') as f:
                    data = json.load(f)
                print(f"Dados brutos carregados de {fname}")
            except Exception as e:
                print(f"Erro ao carregar {fname}: {e}")
                continue
            # O formato dos dados da NASA é um pouco complicado,
            # então vamos usar uma lógica específica para organizar.
            for sol in data:
                if sol.isdigit(): # Verifica se a chave é um número (um "sol" em Marte)
                    day_data = data[sol]
                    # Extrai os dados que queremos: temperatura e pressão
                    if 'AT' in day_data and 'PRE' in day_data:
                        avg_temp = day_data['AT']['av']
                        avg_pressure = day_data['PRE']['av']
                        data_points.append({
                            'sol': sol,
                            'avg_temp': avg_temp,
                            'avg_pressure': avg_pressure,
                            'file': fname
                        })
    # Usa a biblioteca Pandas para criar a "planilha" (DataFrame)
    df = pd.DataFrame(data_points)
    # Exemplo de limpeza: remover dados que não fazem sentido
    df.dropna(inplace=True)
    # Exemplo de conversão: garante que as colunas sejam números
    df['avg_temp'] = pd.to_numeric(df['avg_temp'])
    df['avg_pressure'] = pd.to_numeric(df['avg_pressure'])
    # Se a pasta 'processed_data' não existir, cria
    if not os.path.exists(PROCESSED_DATA_FOLDER):
        os.makedirs(PROCESSED_DATA_FOLDER)
    # Salva o DataFrame limpo em um arquivo CSV (formato de planilha)
    processed_file_path = os.path.join(PROCESSED_DATA_FOLDER, PROCESSED_DATA_FILE)
    df.to_csv(processed_file_path, index=False)
    print(f"Dados processados salvos em: {processed_file_path}")

# 4. A parte que faz o programa rodar
if __name__ == "__main__":
    process_mars_weather_data()