import json
import psycopg2
import os

# Configurações do Banco (Recuperadas do contexto anterior)
DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"
DB_PORT = "10302" # Porta correta confirmada no application.properties

JSON_FILE = r"c:\projtos pessoais\NASA\EcoPathogens\web_app_production\etl\atlas_clean_data.json"

def load_data():
    print("🚀 Iniciando carga no banco de dados...")
    
    try:
        # Conexão
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        cur = conn.cursor()
        print("✅ Conectado ao PostgreSQL!")

        # Tabela de Sazonalidade (criação automática se não existir)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS disaster_seasonality (
            id BIGSERIAL PRIMARY KEY,
            event_type VARCHAR(50) NOT NULL,
            month_name VARCHAR(20) NOT NULL,
            north INT DEFAULT 0,
            northeast INT DEFAULT 0,
            center_west INT DEFAULT 0,
            southeast INT DEFAULT 0,
            south INT DEFAULT 0,
            brasil_total INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
        );
        """)
        
        # Carregar JSON
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)

        human_damage_count = 0
        seasonality_count = 0
        aggregate_count = 0
        
        # Mapeamento para corresponder ao CHECK Constraint do banco
        TYPE_MAP = {
            "Geral": "Dados Agregados",
            "Estiagem e Seca": "Estiagem e Seca",
            "Inundação": "Inundação",
            "Enxurrada": "Enxurrada",
            "Incêndio Florestal": "Incêndio Florestal",
            "Movimento de Massa": "Movimento de Massa",
            "Vendaval/Ciclone": "Vendaval",
            "Granizo": "Granizo",
            "Onda de Frio/Geada": "Geada"
        }

        for item in data:
            # --- NORMALIZAÇÃO DE TIPO (Compartilhada) ---
            raw_type = item.get('disaster_type', 'Dados Agregados')
            raw_type = str(raw_type).replace('"', '').strip() # Garantir string
            event_type = TYPE_MAP.get(raw_type, "Dados Agregados")
            
            if event_type == "Dados Agregados":
                # Heurística de fallback
                if "vendaval" in raw_type.lower(): event_type = "Vendaval"
                elif "frio" in raw_type.lower(): event_type = "Geada"
                elif "massa" in raw_type.lower(): event_type = "Movimento de Massa"
                elif "inundação" in raw_type.lower(): event_type = "Inundação"
                elif "seca" in raw_type.lower(): event_type = "Estiagem e Seca"
                elif "massa" in raw_type.lower(): event_type = "Movimento de Massa"
                elif "inundação" in raw_type.lower(): event_type = "Inundação"
                elif "seca" in raw_type.lower(): event_type = "Estiagem e Seca"
            
            # --- ROTAS DE INSERÇÃO ---
            
            if item['type'] == 'human_damage':
                cur.execute("""
                    INSERT INTO disaster_events (event_type, state_code, event_date, year, source_document)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id;
                """, (event_type, item['state'], f"{item['year']}-01-01", item['year'], f"Atlas PDF - {item['state']}"))
                
                event_id = cur.fetchone()[0]
                
                cur.execute("""
                    INSERT INTO human_damages (event_id, deaths, injured, displaced, affected)
                    VALUES (%s, %s, %s, %s, %s);
                """, (event_id, item['deaths'], item['injured'], item['displaced'], item['deaths'] + item['injured'] + item['displaced']))
                human_damage_count += 1
            
            elif item['type'] == 'aggregate_occurrence':
                # Insere como evento sumário
                # Data fictícia: 2012-12-31 (fim do período)
                cur.execute("""
                    INSERT INTO disaster_events (event_type, state_code, event_date, year, source_document)
                    VALUES (%s, %s, '2012-12-31', 2012, %s);
                """, (event_type, item['state'], f"Atlas Aggregate 1991-2012 (Ocorrências: {item['occurrences']})"))
                aggregate_count += 1
                
            elif item['type'] == 'seasonality':
                # Insere na nova tabela
                cur.execute("""
                    INSERT INTO disaster_seasonality (event_type, month_name, north, northeast, center_west, southeast, south)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                """, (event_type, item['month'], item['north'], item['northeast'], item['center_west'], item['southeast'], item['south']))
                seasonality_count += 1

        conn.commit()
        print(f"✅ Sucesso! Inseridos: {human_damage_count} Danos Humanos, {aggregate_count} Agregados, {seasonality_count} Sazonalidade.")
        
        cur.close()
        conn.close()

    except Exception as e:
        print(f"❌ Erro ao conectar ou inserir: {e}")
        # Tentar porta padrão 5432 se a 19208 falhar (ou checar qual é a correta)

if __name__ == "__main__":
    load_data()
