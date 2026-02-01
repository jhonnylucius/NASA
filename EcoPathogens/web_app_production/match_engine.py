import psycopg2
import requests
import json
from datetime import date, timedelta

# DB Config
DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_PORT = "10302"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"

# Locations (Simple Gazetteer for Prototype)
# Lages/São Joaquim coordinates (High Altitude SC)
LOCATIONS = {
    'SC_FROST_CAPITAL': (-27.8167, -50.3261), # Lages/São Joaquim (Geada)
    'RJ_MOUNTAIN_REGION': (-22.5050, -43.1788), # Petrópolis (Deslizamentos)
    'SP_METRO_AREA': (-23.5505, -46.6333), # São Paulo (Enchentes/Urban)
    'NE_DROUGHT_CORE': (-7.5343, -39.0614), # Sertão Central/Ceará (Seca)
    'AM_FLOOD_ZONE': (-3.1190, -60.0217), # Manaus/Amazonas (Cheias)
}

def get_db_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)

def fetch_nasa_power_data(lat, lon, start_date, end_date):
    """
    Fetches Daily Temperature (T2M_MIN) and Precip (PRECTOTCORR) from NASA POWER API.
    Docs: https://power.larc.nasa.gov/docs/services/api/temporal/daily/
    """
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        'parameters': 'T2M_MIN,PRECTOTCORR', # Min Temp, Precipitation
        'community': 'AG', # Agroclimatology
        'longitude': lon,
        'latitude': lat,
        'start': start_date.strftime('%Y%m%d'),
        'end': end_date.strftime('%Y%m%d'),
        'format': 'JSON'
    }
    print(f"🛰️ Calling NASA POWER API for Lat: {lat}, Lon: {lon} ({start_date} to {end_date})...")
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"❌ Error fetching NASA data: {response.status_code}")
        return None

def find_coldest_days(nasa_data):
    """
    Analyzes NASA data to find the dates with the lowest temperatures.
    """
    if not nasa_data:
        return None
    
    properties = nasa_data.get('properties', {}).get('parameter', {})
    temps = properties.get('T2M_MIN', {})
    
    if not temps:
        return None
        
    # Sort by temperature ascending (lowest temp first)
    # The API returns keys as 'YYYYMMDD' string
    sorted_days = sorted(temps.items(), key=lambda item: item[1])
    return sorted_days[:5] # Return top 5 coldest days

def run_match_engine():
    """
    Main logic: Pick a clue from Atlas, search NASA, store match.
    """
    # CLUE FROM ATLAS: Table 'frost_major_events' says SC had a huge event in 2000.
    # We want to find the EXACT DATE of this event.
    
    target_year = 2000
    # Scan the entire Frost Season (May to Sept)
    start_date = date(target_year, 5, 1) 
    end_date = date(target_year, 9, 30)
    
    # Target Location: The core of the confusion
    lat, lon = LOCATIONS['SC_FROST_CAPITAL']
    
    print(f"🔍 Starting Match Engine for: Frost in Santa Catarina ({target_year})")
    
    nasa_data = fetch_nasa_power_data(lat, lon, start_date, end_date)
    top_frozen_days = find_coldest_days(nasa_data)
    
    if top_frozen_days:
        # The coldest day is the strongest candidate for the disaster date
        best_match_date_str, min_temp = top_frozen_days[0]
        
        # Format date from '20000717' to '2000-07-17'
        best_match_date = f"{best_match_date_str[:4]}-{best_match_date_str[4:6]}-{best_match_date_str[6:]}"
        
        print(f"✅ MATCH FOUND! The coldest day in SC in 2000 was: {best_match_date}")
        print(f"🌡️ Temperature reached: {min_temp}°C")
        
        # Store this discovery in the Database
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            
            # Check if already exists to avoid duplicates
            cur.execute("SELECT id FROM atlas_nasa_matches WHERE atlas_event_description = %s AND suspected_date = %s", ('Grande Geada SC 2000', best_match_date))
            if cur.fetchone():
               print("⚠️ Match already exists in DB.")
            else: 
                query = """
                INSERT INTO atlas_nasa_matches 
                (atlas_source_table, atlas_event_description, suspected_date, nasa_parameter, nasa_value, confidence_level)
                VALUES (%s, %s, %s, %s, %s, %s)
                """
                cur.execute(query, ('frost_major_events', 'Grande Geada SC 2000', best_match_date, 'T2M_MIN', min_temp, 'High'))
                conn.commit()
                print("💾 Match saved to Database table 'atlas_nasa_matches'!")
            
            conn.close()
        except Exception as e:
            print(f"❌ Database Error: {e}")

    else:
        print("❌ No match found in NASA data.")

if __name__ == "__main__":
    run_match_engine()
