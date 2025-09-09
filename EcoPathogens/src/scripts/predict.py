# scripts/predict.py
import pandas as pd
import joblib

def predict():
    # Carregar o modelo treinado
    modelo = joblib.load('output/modelo_treinado.pkl')

    # Carregar os dados para previsão (exemplo com CSV)
    dados_novos = pd.read_csv('data/processed_data/dados_para_prever.csv')

    # Realizar as previsões
    previsoes = modelo.predict(dados_novos)

    # Exibir ou salvar as previsões
    print("Previsões:", previsoes)
    pd.DataFrame(previsoes, columns=['Previsões']).to_csv('output/resultados.csv', index=False)

    print("Previsões geradas com sucesso!")
