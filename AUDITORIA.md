# Auditoria Técnica - EcoPathogens (EcoGuardians)

## 📋 Visão Geral
O projeto **EcoPathogens** (também referenciado como EcoGuardians) é uma aplicação web completa composta por um Frontend baseada em HTML/GSAP e um Backend em Python Flask focado em Machine Learning e visualização de dados.

A estrutura principal para produção encontra-se em `web_app_production/`.

## 🏗️ Estrutura do Projeto

### 1. Frontend (`web_app_production/frontend`)
- **Tecnologia**: HTML5, CSS3, JavaScript (Vanilla).
- **Animações**: GSAP Premium (GreenSock Animation Platform) - *Requer verificação de licença/arquivos locais*.
- **Bibliotecas**: Chart.js, Leaflet, Plotly.js, Axios.
- **Gerenciamento**: NPM (Node Package Manager).
- **Servidor Local**: `live-server` (configurado no package.json).

### 2. Backend / Machine Learning API (`web_app_production/python_ml_api`)
- **Tecnologia**: Python 3.11.
- **Framework**: Flask (API REST).
- **Dados**: Pandas, NumPy, Scikit-learn.
- **Cloud**: Boto3 (AWS SDK).
- **Infraestrutura**: Scripts para AWS e Docker.

### 3. Infraestrutura (`web_app_production/infrastructure`)
- Scripts Shell para deploy e execução local (`dev-start.sh`, `deploy.sh`).
- Configurações para AWS (EC2, S3, CloudFront).

---

## 🛠️ Pré-requisitos para Instalação

Para rodar o projeto localmente ("aqui na Antigravity" ou em sua máquina), você precisará das seguintes ferramentas instaladas:

1.  **Node.js & NPM**: Para gerenciar dependências do frontend e rodar o servidor de desenvolvimento.
    -   *Verifique com:* `node -v` e `npm -v`
2.  **Python 3.11**: Para rodar a API e os modelos de ML.
    -   *Verifique com:* `python --version`
3.  **PIP**: Gerenciador de pacotes Python.
4.  **AWS CLI** (Opcional para dev local, obrigatório para deploy): Para interagir com a AWS.

---

## 🚀 Como Rodar o Projeto (Passo a Passo)

### 1. Configuração do Backend (API Python)

Navegue até a pasta da API e instale as dependências:

```bash
cd "c:\projtos pessoais\NASA\EcoPathogens\web_app_production\python_ml_api"
# Recomendo criar um ambiente virtual (opcional mas boa prática)
python -m venv venv
# Ativar venv:
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

Para rodar a API:
```bash
python app.py
# A API deve iniciar em http://localhost:5000
```

### 2. Configuração do Frontend

Navegue até a pasta do frontend e instale as dependências:

```bash
cd "c:\projtos pessoais\NASA\EcoPathogens\web_app_production\frontend"
npm install
```

Para rodar o Frontend:
```bash
npm start
# Isso deve abrir o navegador em http://localhost:3000 (ou porta similar)
```

> **Nota sobre Script de Dev**: Existe um script `infrastructure/dev-start.sh` que tenta automatizar isso, mas ele é um script Shell (Linux/Mac). No Windows, você pode precisar rodá-lo via WSL ou Git Bash, ou rodar os comandos acima manualmente.

---

## ⚠️ Pontos de Atenção

1.  **GSAP Premium**: ✅ **VERIFICADO**. A pasta `frontend/public/assets/js/gsap` contém 20 itens, indicando que os plugins estão presentes localmente. Isso é excelente e significa que as animações devem funcionar sem problemas.

2.  **AWS Credentials**: Se a aplicação tentar conectar à AWS (via `boto3`), você precisará configurar suas credenciais (`aws configure`) ou definir variáveis de ambiente, caso contrário, erros de permissão ocorrerão ao tentar acessar S3 ou outros serviços.

3.  **Variáveis de Ambiente**: Verifique se há arquivos `.env` necessários na pasta `python_ml_api`. O [requirements.txt](file:///c:/projtos%20pessoais/NASA/EcoPathogens/src/requirements.txt) lista `python-dotenv`, sugerindo que variáveis de ambiente são usadas.

## ✅ Próximos Passos Sugeridos

1.  Validar se os arquivos do GSAP estão presentes.
2.  Tentar subir a API Python localmente e verificar se conecta aos modelos.
3.  Subir o Frontend e testar a navegação básica.
