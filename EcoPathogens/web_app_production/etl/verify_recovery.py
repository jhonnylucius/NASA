import psycopg2

DB_CONFIG = {
    "host": "postgresql-194952-0.cloudclusters.net",
    "database": "NASA",
    "user": "luciano",
    "password": "postgresql",
    "port": "10302"
}

def verify():
    print("📊 Verificando Recuperação de Dados do Atlas...\n")
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # 1. Disaster Events by Type
        print("--- EVENTOS PRINCIPAIS (Incluindo Agregados) ---")
        cur.execute("""
            SELECT event_type, COUNT(*) 
            FROM disaster_events 
            GROUP BY event_type 
            ORDER BY COUNT(*) DESC
        """)
        for row in cur.fetchall():
            print(f"- {row[0]}: {row[1]}")
            
        print("\n--- SAZONALIDADE (Meses/Tipos) ---")
        try:
            cur.execute("""
                SELECT event_type, COUNT(*) 
                FROM disaster_seasonality 
                GROUP BY event_type 
                ORDER BY COUNT(*) DESC
            """)
            for row in cur.fetchall():
                print(f"- {row[0]}: {row[1]} registros mensais")
        except Exception as e:
            print("⚠️ Tabela de sazonalidade não encontrada ou vazia.")
            
        print("\n--- CONEXÃO COM NASA (Reconstrução) ---")
        cur.execute("""
            SELECT COUNT(*) FROM environmental_snapshots 
            WHERE source_api = 'ATLAS_REANALYSIS'
        """)
        recon = cur.fetchone()[0]
        print(f"Total Reconstruídos: {recon}")
        
        cur.execute("""
            SELECT COUNT(*) FROM disaster_events 
            WHERE source_document LIKE '%NASA Match%'
        """)
        linked = cur.fetchone()[0]
        print(f"Total Linkados (Match Engine): {linked}")

        conn.close()
        
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    verify()
