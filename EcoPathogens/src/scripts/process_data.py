# scripts/process_data.py
import pandas as pd

def process_data():
    # Carregar os dados brutos (exemplo com CSV)
    dados_brutos = pd.read_csv('data/raw_data/seu_arquivo.csv')

    # Limpar e transformar os dados
    dados_processados = dados_brutos.dropna()  # Exemplo de remoção de valores nulos
    dados_processados.to_csv('data/processed_data/dados_processados.csv', index=False)

    print("Dados processados com sucesso!")
