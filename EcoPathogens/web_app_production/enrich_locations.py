import psycopg2
import requests
import time

# DB Config
DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_PORT = "10302"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"

def get_db_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)

def add_columns_if_missing():
    print("🔧 Checking/Adding schema columns...")
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("ALTER TABLE disaster_events ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 6);")
        cur.execute("ALTER TABLE disaster_events ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 6);")
        conn.commit()
        print("✅ Columns 'latitude' and 'longitude' ready.")
    except Exception as e:
        print(f"❌ Error adding columns: {e}")
        conn.rollback()
    finally:
        conn.close()

def fetch_ibge_coords():
    print("🌍 Fetching Brazil Municipalities from IBGE API...")
    url = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
    try:
        response = requests.get(url)
        data = response.json()
        print(f"📦 Loaded {len(data)} municipalities from IBGE.")
        return {str(m['id']): m['nome'] for m in data} # Basic map for names
    except Exception as e:
        print(f"❌ Failed to fetch IBGE data: {e}")
        return {}

def enrich_data():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # 1. Get events without coords
    print("🔍 Finding events without coordinates...")
    cur.execute("SELECT id, municipality_code, municipality_name, state_code FROM disaster_events WHERE latitude IS NULL OR longitude IS NULL")
    events = cur.fetchall()
    print(f"📋 Found {len(events)} pending events.")

    if not events:
        print("🎉 All events already enriched!")
        return

    # 2. Need Lat/Lon. IBGE API above just gave names. 
    # Better source: https://raw.githubusercontent.com/kelvins/municipios-brasileiros/main/csv/municipios.csv
    # Or use OpenStreetMap/Nominatim per city (slow but accurate)
    # Strategy: Use a known GitHub dataset for simple Lat/Lon lookup by Code
    
    print("📥 Downloading Coordinator Dictionary...")
    coord_url = "https://raw.githubusercontent.com/kelvins/municipios-brasileiros/main/csv/municipios.csv"
    coords_map = {} # code -> (lat, lon)
    try:
        resp = requests.get(coord_url)
        lines = resp.text.split('\n')
        # Format: codigo_ibge,nome,latitude,longitude,capital,codigo_uf
        for line in lines[1:]: # Skip header
            parts = line.split(',')
            if len(parts) >= 4:
                code_7_digit = parts[0]
                code_6_digit = code_7_digit[:6] # Sometimes DB uses 6 digits
                lat = float(parts[2])
                lon = float(parts[3])
                coords_map[code_7_digit] = (lat, lon)
                coords_map[code_6_digit] = (lat, lon)
        print(f"🗺️ Mapped {len(coords_map)} coordinates.")
    except Exception as e:
        print(f"❌ Error downloading coordinates: {e}")
        return

    # 3. Update Loop
    updated_count = 0
    for evt in events:
        evt_id, mun_code, mun_name, state = evt
        
        # Try finding by code
        lat_lon = coords_map.get(str(mun_code))
        
        if not lat_lon:
             # Fallback: Try with first 6 digits if 7 provided
             if mun_code and len(str(mun_code)) == 7:
                 lat_lon = coords_map.get(str(mun_code)[:6])
        
        if lat_lon:
            lat, lon = lat_lon
            try:
                cur.execute("UPDATE disaster_events SET latitude = %s, longitude = %s WHERE id = %s", (lat, lon, evt_id))
                updated_count += 1
                if updated_count % 50 == 0:
                    conn.commit()
                    print(f"   Saved {updated_count}...")
            except Exception as e:
                print(f"   ❌ DB Error on ID {evt_id}: {e}")
                conn.rollback()
        else:
            print(f"   ⚠️ Coord not found for: {mun_name} ({mun_code}) - {state}")

    conn.commit()
    conn.close()
    print(f"🏁 Enrichment Complete. Updated {updated_count}/{len(events)} records.")

if __name__ == "__main__":
    add_columns_if_missing()
    enrich_data()
