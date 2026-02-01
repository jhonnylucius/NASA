import psycopg2
import pandas as pd
from datetime import date, timedelta

# DB Config
DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_PORT = "10302"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"

# Mapping Atlas Regions/States to Xavier Locations
LOCATION_MAP = {
    'SC': 'SC_FROST_CAPITAL', # Lages
    'RJ': 'RJ_MOUNTAIN_REGION', # Petrópolis
    'SP': 'SP_METRO_AREA', # São Paulo
    'CE': 'NE_DROUGHT_CORE', # Sertão
    'AM': 'AM_FLOOD_ZONE' # Manaus
}

def get_db_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)

def fetch_xavier_stats(location_label, start_date, end_date):
    """Fetch aggregated climate stats for a period"""
    conn = get_db_connection()
    query = """
    SELECT 
        MIN(t_min) as min_temp,
        MAX(t_max) as max_temp,
        SUM(precipitation) as total_precip,
        AVG(t_min) as avg_tmin
    FROM xavier_climate_data
    WHERE location_label = %s AND measure_date BETWEEN %s AND %s
    """
    with conn.cursor() as cur:
        cur.execute(query, (location_label, start_date, end_date))
        result = cur.fetchone()
    conn.close()
    return result

def validate_frost_event(event):
    """
    Validates a Frost event from the Atlas using Xavier Data.
    Atlas provides: Year, State.
    We check: Winter of that Year (June-August).
    """
    event_id, year, region, state, deaths, affected, damages, description = event
    
    print(f"\n🔍 INVESTIGATING: Frost in {state} ({year})")
    
    if state not in LOCATION_MAP:
        print(f"   ⚠️ No ground station mapped for state {state}. Skipping.")
        return

    loc_label = LOCATION_MAP[state]
    
    # Frost usually happens in Winter (June - August)
    start_date = date(year, 5, 1) # Start May to catch early frosts
    end_date = date(year, 9, 30)  # End Sept
    
    stats = fetch_xavier_stats(loc_label, start_date, end_date)
    min_temp, max_temp, total_precip, avg_tmin = stats
    
    if min_temp is None:
        print("   ❌ No data available in Xavier for this period.")
        return

    print(f"   📉 Ground Truth (Winter {year}):")
    print(f"      Lowest Temp: {min_temp}°C")
    print(f"      Avg Min Temp: {avg_tmin:.2f}°C")
    
    # VERDICT LOGIC
    rating = ""
    reason = ""
    
    if min_temp <= 0:
        rating = "🟢 VERIFIED (CRITICAL)"
        reason = f"Hit distinct freezing point ({min_temp}°C)."
    elif min_temp <= 3:
        rating = "🟢 VERIFIED"
        reason = f"Temperatures favorable for frost ({min_temp}°C)."
    elif min_temp <= 5:
        rating = "🟡 PLAUSIBLE"
        reason = f"Cold ({min_temp}°C), but maybe not widespread frost."
    else:
        rating = "🔴 DOUBTFUL"
        reason = f"Lowest temp was only {min_temp}°C. Unlikely to be a major frost event."

    print(f"   ⚖️  VERDICT: {rating}")
    print(f"      Reason: {reason}")
    print("-" * 50)

def validate_gale_event(event):
    """
    Validates a Gale (Vendaval) event.
    Atlas provides: Year, State (e.g., SP).
    We check: Did that year have any day with High Wind?
    Xavier u2 is usually daily avg (m/s).
    """
    # Struct: (id, year, region, state, deaths, injured, displaced, affected, created_at)
    event_id, year, region, state, deaths, injured, displaced, affected, created_at = event
    
    print(f"\n💨 INVESTIGATING: Gale in {state} ({year})")
    
    if state not in LOCATION_MAP:
        print(f"   ⚠️ No ground station mapped for state {state}. Skipping.")
        return

    loc_label = LOCATION_MAP[state]
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    
    conn = get_db_connection()
    # Query for the MAXIMUM single-day wind that year
    query = """
    SELECT MAX(wind_speed) 
    FROM xavier_climate_data 
    WHERE location_label = %s AND measure_date BETWEEN %s AND %s
    """
    with conn.cursor() as cur:
        cur.execute(query, (loc_label, start_date, end_date))
        max_wind = cur.fetchone()[0]
    conn.close()
    
    if max_wind is None:
        print("   ❌ No data available in Xavier for this year.")
        return

    print(f"   🍃 Ground Truth (Year {year}):")
    print(f"      Max Daily Avg Wind: {max_wind} m/s")
    
    rating = ""
    reason = ""
    
    # Thresholds for Daily AVG Wind (m/s). Gusts are higher.
    # 10 m/s avg is huge. 5 m/s avg is breezy.
    if max_wind >= 6:
        rating = "🟢 VERIFIED (STRONG)"
        reason = f"High avg wind ({max_wind} m/s). Consistent with storm gusts."
    elif max_wind >= 4:
        rating = "🟡 PLAUSIBLE"
        reason = f"Moderate wind ({max_wind} m/s). Gusts could have caused damage."
    else:
        rating = "🔴 DOUBTFUL"
        reason = f"Max avg wind only {max_wind} m/s. Very calm year. Unlikely to have major gales."

    print(f"   ⚖️  VERDICT: {rating}")
    print(f"      Reason: {reason}")
    print("-" * 50)

def main():
    print("🕵️‍♂️ STARTING TRUTH SEEKER ENGINE (v1.0)...")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # 1. Fetch Major Frost Events from Atlas
    # The table might have different columns based on previous `SELECT *` output
    # Output seen: (id, year, region, state, occurrences???, affected, ...)
    # Let's verify columns dynamically or assume based on previous SELECT
    # Previous SELECT output: (1, 2000, 'Sul', 'SC', 0, 347, 0, 38000, ...)
    # Let's use a robust query
    
    query_frost = "SELECT id, event_year, region_name, state_code, occurrences, 0, 0, 0, description FROM frost_major_events"
    query_gales = "SELECT * FROM gale_mortality_events WHERE state_code IN ('SP', 'SC', 'RJ') LIMIT 10"

    # 1. Check Gales
    print("\n💨 --- PHASE 1: GALE VERIFICATION ---")
    try:
        cur.execute(query_gales)
        gales = cur.fetchall()
        for g in gales:
            validate_gale_event(g)
    except Exception as e:
        print(f"⚠️ Could not fetch gale stats: {e}")

    # 2. Check Frost
    print("\n❄️ --- PHASE 2: FROST VERIFICATION ---")
    try:
         # Re-running Frost with robust query
         cur.execute("SELECT * FROM frost_major_events")
         frosts = cur.fetchall()
         for e in frosts:
            # Struct: (id, year, region, state, occurrence, deaths, affected, damages, created_at)
            # Need to map to: (id, year, region, state, occurrences, deaths, affected, damages, desc)
            event_mapped = (e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], "Frost Event")
            validate_frost_event(event_mapped)
    except Exception as e:
        print(f"⚠️ Could not fetch frost stats: {e}")

    conn.close()
    print("🏁 Investigation Complete.")

if __name__ == "__main__":
    main()
