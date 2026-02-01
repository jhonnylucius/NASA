import pandas as pd
import json
import re

# Caminhos
INPUT_CSV = r"c:\projtos pessoais\NASA\EcoPathogens\web_app_production\atlas_dados_brutos.csv"
OUTPUT_JSON = r"c:\projtos pessoais\NASA\EcoPathogens\web_app_production\etl\atlas_clean_data.json"

def clean_data():
    print("🧹 Iniciando limpeza dos dados...")
    
    # Lista para guardar os registros limpos
    clean_records = []
    
    try:
        # Lendo o CSV bruto sem cabeçalho, pois ele é bagunçado
        df = pd.read_csv(INPUT_CSV, header=None)
        
        for index, row in df.iterrows():
            # Limpa NaNs da linha (o pandas preenche com NaN se houver colunas extras no CSV)
            clean_vals = [str(x) for x in row.values if str(x) != 'nan' and str(x).strip() != '']
            
            if not clean_vals:
                continue

            # O último elemento é o TIPO DE DESASTRE (se a linha foi extraída corretamente)
            disaster_type = clean_vals[-1]
            
            # O conteúdo é tudo menos o tipo
            row_content = clean_vals[:-1]
            row_str = ",".join(row_content)
            
            # Padrão 1: Linhas de Danos Humanos (Ano, Região, Estado, Mortos...)
            # Ex: 2011,Sudeste,SP,1,0,0,3
            # Regex busca: Começa com ano (19xx ou 20xx), tem texto, tem sigla de estado
            match_human = re.search(r'(\d{4}),([a-zA-Zá-úÁ-Ú-]+),([A-Z]{2}),(\d+),(\d+),(\d+)', row_str)
            
            if match_human:
                try:
                    record = {
                        "type": "human_damage",
                        "disaster_type": disaster_type,   # <--- CAPTURED TYPE
                        "year": int(match_human.group(1)),
                        "region": match_human.group(2),
                        "state": match_human.group(3),
                        "deaths": int(match_human.group(4)),
                        "injured": int(match_human.group(5)),
                        "displaced": int(match_human.group(6)), # Desalojados/Desabrigados somados ou coluna específica
                        "raw_source": row_str
                    }
                    clean_records.append(record)
                    continue
                except:
                    pass

            # Padrão 3: Agregados por Estado (Mesorregiões, Municípios, Ocorrências)
            # Tabela 1, Tabela 2 etc.
            # Ex: GO,5,21,26
            # Regex: Sigla Estado (inicio), numero, numero, numero
            match_agg = re.search(r'^([A-Z]{2}),(\d+),(\d+),(\d+)', row_str)
            if match_agg:
                try:
                    record = {
                        "type": "aggregate_occurrence",
                        "disaster_type": disaster_type,
                        "state": match_agg.group(1),
                        "mesoregions": int(match_agg.group(2)),
                        "municipalities": int(match_agg.group(3)),
                        "occurrences": int(match_agg.group(4)),
                        "raw_source": row_str
                    }
                    clean_records.append(record)
                    continue
                except:
                    pass

            # Padrão 2: Sazonalidade (Meses)
            # Ex: Janeiro,0,1,0,215,14,230
            meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                     'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
            
            first_col = str(row[0]).strip()
            if first_col in meses:
                # Tenta capturar os números subsequentes
                try:
                    # Assumindo colunas: Mes, N, NE, CO, SE, S, BR
                    # Limpeza extra para números com pontos (milhar)
                    vals = [str(x).replace('.', '') for x in row.values if str(x).replace('.','').isdigit()]
                    
                    if len(vals) >= 5: # Pelo menos as regiões
                        record = {
                            "type": "seasonality",
                            "disaster_type": disaster_type, # <--- ADICIONADO TIPO
                            "month": first_col,
                            "north": int(vals[0]),
                            "northeast": int(vals[1]),
                            "center_west": int(vals[2]),
                            "southeast": int(vals[3]),
                            "south": int(vals[4]),
                            "raw_source": row_str
                        }
                        clean_records.append(record)
                except:
                    pass

        print(f"✨ Limpeza concluída! Recuperados {len(clean_records)} registros úteis.")
        
        # Salvando em JSON
        with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
            json.dump(clean_records, f, indent=4, ensure_ascii=False)
            
        print(f"💾 Arquivo limpo salvo em: {OUTPUT_JSON}")
        
    except Exception as e:
        print(f"❌ Erro na limpeza: {e}")

if __name__ == "__main__":
    clean_data()
