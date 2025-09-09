
import requests
from datetime import datetime, timedelta
import os
import json
import argparse

API_KEY = "nA28mj7EMOPiKhlQdeaaJbxhhUHFCrbFwt9HciOC"
RAW_DATA_DIR = os.path.join(os.path.dirname(__file__), '../../data/raw_data')
os.makedirs(RAW_DATA_DIR, exist_ok=True)

def save_json(data, filename):
    path = os.path.join(RAW_DATA_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Dados salvos em {path}")

def fetch_endpoint(url, params, filename):
    response = requests.get(url, params=params)
    response.raise_for_status()
    save_json(response.json(), filename)

def main():

    parser = argparse.ArgumentParser(description="Coletor flexível de dados das APIs da NASA.")
    parser.add_argument('--config', type=str, help='Arquivo JSON com endpoints e parâmetros a consultar.')
    args = parser.parse_args()

    if args.config:
        with open(args.config, 'r', encoding='utf-8') as f:
            config = json.load(f)
        for entry in config.get('requests', []):
            url = entry['url']
            params = entry.get('params', {})
            params['api_key'] = API_KEY
            filename = entry.get('filename') or f"output_{datetime.utcnow().isoformat()}.json"
            fetch_endpoint(url, params, filename)
    else:
        # Modo 50 anos: executa todos os endpoints em intervalos anuais
        today = datetime.utcnow().date()
        start_year = today.year - 50
        # APOD: coleta uma imagem por dia dos últimos 50 anos (atenção: pode ser muito volume)
        for year in range(start_year, today.year + 1):
            for month in range(1, 13):
                for day in range(1, 32):
                    try:
                        date = datetime(year, month, day).date()
                        if date > today:
                            break
                        fetch_endpoint(
                            "https://api.nasa.gov/planetary/apod",
                            {"date": str(date), "api_key": API_KEY},
                            f"apod_{date}.json"
                        )
                    except ValueError:
                        continue
        # NEO FEED: coleta por ano
        for year in range(start_year, today.year + 1):
            start_date = datetime(year, 1, 1).date()
            end_date = datetime(year, 12, 31).date()
            if end_date > today:
                end_date = today
            fetch_endpoint(
                "https://api.nasa.gov/neo/rest/v1/feed",
                {"start_date": str(start_date), "end_date": str(end_date), "api_key": API_KEY},
                f"neo_feed_{start_date}_to_{end_date}.json"
            )
        # NEO BROWSE: coleta uma vez (não tem filtro de data)
        fetch_endpoint(
            "https://api.nasa.gov/neo/rest/v1/neo/browse",
            {"api_key": API_KEY},
            f"neo_browse_{today}.json"
        )
        # DONKI ENDPOINTS: coleta por ano
        donki_endpoints = [
            "CME", "CMEAnalysis", "GST", "IPS", "FLR", "SEP", "MPC", "RBE", "HSS", "WSAEnlilSimulations", "notifications"
        ]
        for endpoint in donki_endpoints:
            for year in range(start_year, today.year + 1):
                start_date = datetime(year, 1, 1).date()
                end_date = datetime(year, 12, 31).date()
                if end_date > today:
                    end_date = today
                fetch_endpoint(
                    f"https://api.nasa.gov/DONKI/{endpoint}",
                    {"startDate": str(start_date), "endDate": str(end_date), "api_key": API_KEY},
                    f"donki_{endpoint.lower()}_{start_date}_to_{end_date}.json"
                )
        # EPIC ENDPOINTS: coleta imagens naturais por ano
        for year in range(start_year, today.year + 1):
            # Todas as datas disponíveis (uma vez)
            if year == start_year:
                fetch_endpoint(
                    "https://api.nasa.gov/EPIC/api/natural/all",
                    {"api_key": API_KEY},
                    f"epic_natural_all_dates.json"
                )
            # Imagens naturais de uma data específica (exemplo: 2019-05-30)
            try:
                date = datetime(year, 5, 30).date()
                fetch_endpoint(
                    f"https://api.nasa.gov/EPIC/api/natural/date/{date}",
                    {"api_key": API_KEY},
                    f"epic_natural_{date}.json"
                )
            except Exception:
                continue
        # Imagens naturais mais recentes (uma vez)
        fetch_endpoint(
            "https://api.nasa.gov/EPIC/api/natural/images",
            {"api_key": API_KEY},
            f"epic_natural_images_{today}.json"
        )

if __name__ == "__main__":
    main()
