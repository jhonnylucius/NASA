import psycopg2
import json

# Config DB
DB_CONFIG = {
    "host": "postgresql-194952-0.cloudclusters.net",
    "database": "NASA",
    "user": "luciano",
    "password": "postgresql",
    "port": "10302"
}

# Bounding Boxes Aproximados para Estados (Simplificado)
# [min_lat, max_lat, min_lon, max_lon]
STATE_BBOX = {
    "SP": [-25.3, -19.8, -53.1, -44.2],
    "RJ": [-23.4, -20.8, -44.9, -40.9],
    "MG": [-22.9, -14.2, -51.1, -39.8],
    "ES": [-21.3, -17.9, -41.9, -28.8], # ES tem ilhas, mas foco no continente
    "PR": [-26.7, -22.5, -54.6, -48.0],
    "SC": [-29.4, -25.9, -53.8, -48.3],
    "RS": [-33.7, -27.1, -57.6, -49.7],
    # Adicionar outros conforme necessidade de teste
}

def match_engine():
    print("🕵️ Iniciando Match Engine (Atlas x NASA)...")
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # BUSCAR EVENTOS DO ATLAS (Agora podem ter tipos específicos)
    cur.execute("""
        SELECT id, event_type, municipality_name, state_code, year 
        FROM disaster_events 
        WHERE source_document LIKE 'Atlas PDF%%'
        AND source_document NOT LIKE '%%NASA Match%%' -- Evitar re-processar
    """)
    atlas_events = cur.fetchall()
    
    print(f"🎯 Encontrados {len(atlas_events)} eventos para tentar correlacionar.")
    
    matches_count = 0
    
    for evt in atlas_events:
        evt_id, evt_type, city, state, year = evt
        
        # 1. Definir Bounding Box (Simplificado por Estado)
        bbox = STATE_BBOX.get(state, [-54, -34, -45, -5]) # Default Brazilish
        
        # 2. Consultar NASA DB (environmental_snapshots)
        # Queremos eventos no MESMO ANO e DENTRO DA PROXIMIDADE GEOGRÁFICA
        cur.execute("""
            SELECT event_date, event_type, region_name
            FROM environmental_snapshots
            WHERE event_year = %s
            AND latitude BETWEEN %s AND %s
            AND longitude BETWEEN %s AND %s
            LIMIT 1 -- Pega o primeiro match relevante
        """, (year, bbox[2], bbox[3], bbox[0], bbox[1]))
        
        match = cur.fetchone()
        
        if match:
            nasa_date, nasa_type, nasa_region = match
            print(f"✅ MATCH! Atlas ({year} {state} {evt_type}) <-> NASA ({nasa_type})")
            
            # Se já temos um tipo específico do Atlas, mantemos.
            # Se for 'Dados Agregados', tentamos melhorar.
            final_type = evt_type
            if evt_type == 'Dados Agregados' or evt_type == 'Outros':
                 # Tenta inferir do dado da NASA
                if 'Flood' in nasa_type: final_type = 'Inundação'
                elif 'Storm' in nasa_type: final_type = 'Enxurrada'
                elif 'Fire' in nasa_type: final_type = 'Incêndio Florestal'
                elif 'Drought' in nasa_type: final_type = 'Estiagem e Seca'
            
            try:
                cur.execute("""
                    UPDATE disaster_events 
                    SET event_type = %s,
                        event_date = %s,
                        source_document = source_document || ' + NASA Match'
                    WHERE id = %s
                """, (final_type, nasa_date, evt_id))
                matches_count += 1
                conn.commit() # Commit a cada match para garantir progressão
            except Exception as e:
                print(f"⚠️ Erro ao atualizar evento {evt_id}: {e}")
                conn.rollback() # Rollback pontual
                continue
                
        conn.commit() # Commit em lotes ou ao final

    print(f"🏁 Processo finalizado. {matches_count} eventos enriquecidos com dados de satélite.")
    conn.close()

if __name__ == "__main__":
    match_engine()
