# scripts/train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def train_model():
    # Carregar os dados processados
    dados = pd.read_csv('data/processed_data/dados_processados.csv')

    # Separar as variáveis independentes (X) e a variável dependente (y)
    X = dados.drop('target_column', axis=1)  # Substitua 'target_column' pelo nome da sua coluna de alvo
    y = dados['target_column']  # A coluna com os resultados que queremos prever

    # Dividir os dados em treino e teste
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Criar e treinar o modelo
    modelo = RandomForestClassifier()
    modelo.fit(X_train, y_train)

    # Avaliar o modelo
    y_pred = modelo.predict(X_test)
    print(f'Acurácia do modelo: {accuracy_score(y_test, y_pred)}')
    
    # Salvar o modelo treinado (opcional)
    import joblib
    joblib.dump(modelo, 'output/modelo_treinado.pkl')
    
    print("Modelo treinado com sucesso!")
