import psycopg2
import json
import random

# Config DB
DB_CONFIG = {
    "host": "postgresql-194952-0.cloudclusters.net",
    "database": "NASA",
    "user": "luciano",
    "password": "postgresql",
    "port": "10302"
}

# Centroides aproximados (Lat/Lon) para "Ancorar" o evento no mapa
STATE_CENTROIDS = {
    "AC": [-9.0, -70.0], "AL": [-9.5, -36.5], "AP": [1.0, -51.0], "AM": [-3.0, -60.0],
    "BA": [-12.0, -41.0], "CE": [-5.0, -39.0], "DF": [-15.8, -47.9], "ES": [-19.5, -40.5],
    "GO": [-16.0, -50.0], "MA": [-5.0, -45.0], "MT": [-13.0, -56.0], "MS": [-20.5, -55.0],
    "MG": [-18.5, -44.5], "PA": [-3.5, -52.0], "PB": [-7.0, -36.0], "PR": [-24.5, -51.5],
    "PE": [-8.5, -37.0], "PI": [-7.0, -42.5], "RJ": [-22.5, -43.5], "RN": [-5.5, -36.5],
    "RS": [-30.0, -53.0], "RO": [-11.0, -63.0], "RR": [2.0, -61.0], "SC": [-27.0, -50.0],
    "SP": [-22.0, -48.5], "SE": [-10.5, -37.5], "TO": [-10.0, -48.0]
}

def reconstruct():
    print("🏗️ Iniciando Reconstrução Histórica (Atlas -> NASA Table)...")
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    print("🧹 Limpando reconstruções antigas para evitar duplicatas...")
    cur.execute("DELETE FROM environmental_snapshots WHERE source_api = 'ATLAS_REANALYSIS'")
    conn.commit()
    
    # 1. Pega os eventos do Atlas que já carregamos
    cur.execute("""
        SELECT id, year, state_code, source_document, event_type
        FROM disaster_events 
        WHERE source_document LIKE 'Atlas PDF%%'
    """)
    atlas_events = cur.fetchall()
    
    inserted = 0
    
    for evt in atlas_events:
        evt_id, year, state, source, orig_type = evt
        
        # Se não temos coordenadas para o estado, pulamos (ou usamos Brasil default)
        centroid = STATE_CENTROIDS.get(state, [-14.2, -51.9]) 
        
        # Verificar se já existe snapshot
        check_query = """
            SELECT id FROM environmental_snapshots 
            WHERE source_api = 'ATLAS_REANALYSIS' 
            AND event_year = %s 
            AND region_name = %s
            AND event_type = %s
        """
        # Adicionei event_type na chave de unicidade para permitir recriar "Enchente" e "Seca" no mesmo ano/estado
        cur.execute(check_query, (year, f"{state} (Atlas)", f"{orig_type} (Reconstructed)"))
        if cur.fetchone():
            print(f"⏩ {year}-{state}-{orig_type}: Já existe.")
            continue

        title = f"Historical {orig_type} - {state} {year}"
        
        # JSON Metadata para rastreabilidade científica
        meta = json.dumps({
            "methodology": "Atlas Brasileiro Reverse Engineering",
            "original_source_id": evt_id,
            "title": title  # Title moved to JSON features
        })
        
        insert_sql = """
            INSERT INTO environmental_snapshots (
                event_date, event_year, event_type, 
                region_name, source_api, 
                latitude, longitude, features
            ) VALUES (
                %s, %s, %s, 
                %s, 'ATLAS_REANALYSIS', 
                %s, %s, %s
            ) RETURNING id;
        """
        
        cur.execute(insert_sql, (
            f"{year}-01-01",
            year,
            f"{orig_type} (Reconstructed)", # Tipo ESPECÍFICO agora!
            f"{state} (Atlas)",
            centroid[0],
            centroid[1],
            meta
        ))
        inserted += 1
        
    conn.commit()
    conn.close()
    print(f"✅ Sucesso! {inserted} eventos históricos reconstruídos na tabela `environmental_snapshots`.")

if __name__ == "__main__":
    reconstruct()
