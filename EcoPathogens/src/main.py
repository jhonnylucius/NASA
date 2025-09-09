# Importando os scripts
from scripts.process_data import process_data
from scripts.train_model import train_model
from scripts.predict import predict

def main():
    # Passo 1: Processar os dados
    print("Processando dados...")
    process_data()

    # Passo 2: Treinar o modelo
    print("Treinando o modelo...")
    train_model()

    # Passo 3: Fazer previsões
    print("Gerando previsões...")
    predict()

if __name__ == "__main__":
    main()

