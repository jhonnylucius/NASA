import psycopg2
import requests
import datetime
from datetime import date, timedelta
import time
import json

# --- CONFIGURATION ---
DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_PORT = "10302"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"

# User-Defined Thresholds (The "Truth")
THRESHOLDS = {
    'Geada': {'param': 'T2M_MIN', 'op': '<=', 'val': 3.0, 'unit': 'C'},
    'Inundação': {'param': 'PRECTOTCORR', 'op': '>=', 'val': 50.0, 'window': 7, 'unit': 'mm (7-day)'}, # Accum 7 days
    'Enxurrada': {'param': 'PRECTOTCORR', 'op': '>=', 'val': 1600.0, 'annual': True, 'unit': 'mm (Annual)'}, # Annual Sum
    'Alagamento': {'param': 'PRECTOTCORR', 'op': '>=', 'val': 1500.0, 'annual': True, 'unit': 'mm (Annual)'}, # Annual Sum
    'Vendaval': {'param': 'WS2M', 'op': '>=', 'val': 5.0, 'unit': 'm/s'},
    'Estiagem e Seca': {'param': 'PRECTOTCORR', 'op': '<=', 'val': 500.0, 'annual': True, 'unit': 'mm (Annual)'}, # Specific for NE
    # Tornado handled as Wind > 5m/s (proxy) or specific peak analysis
    'Tornado': {'param': 'WS2M', 'op': '>=', 'val': 15.0, 'unit': 'm/s (Peak)'}, # Higher threshold for Tornado
    'Incêndio Florestal': {'param': 'T2M_MAX', 'op': '>=', 'val': 30.0, 'unit': 'C'} # Hot days as proxy
}

# State Geometric Centers (Approximate) to use as Proxy for the whole state
STATE_CENTERS = {
    'AC': (-9.0238, -70.8120), 'AL': (-9.5713, -36.7820), 'AM': (-3.4168, -65.8561),
    'AP': (0.9020, -52.0030), 'BA': (-12.5797, -41.7007), 'CE': (-5.4984, -39.3206),
    'DF': (-15.7998, -47.8645), 'ES': (-19.1834, -40.3089), 'GO': (-15.8270, -49.8362),
    'MA': (-5.6171, -45.2497), 'MG': (-18.5122, -44.5550), 'MS': (-20.7722, -54.7816),
    'MT': (-12.6819, -56.9211), 'PA': (-1.9981, -54.9306), 'PB': (-7.2399, -36.7819),
    'PE': (-8.8137, -36.9541), 'PI': (-7.7183, -42.7289), 'PR': (-24.89, -51.55),
    'RJ': (-22.9099, -43.1818), 'RN': (-5.4026, -36.9541), 'RO': (-11.5057, -63.5806),
    'RR': (2.7376, -62.0751), 'RS': (-30.0346, -51.2177), 'SC': (-27.2423, -50.2189),
    'SE': (-10.5741, -37.3857), 'SP': (-23.5489, -46.6388), 'TO': (-10.1753, -48.2982)
}

def get_db_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)

def fetch_nasa_data(lat, lon, year):
    """
    Fetches daily data for the ENTIRE year to find peaks.
    """
    start_date = f"{year}0101"
    end_date = f"{year}1231"
    
    # NASA POWER API
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        'parameters': 'T2M_MIN,T2M_MAX,PRECTOTCORR,WS2M',
        'community': 'AG',
        'longitude': lon,
        'latitude': lat,
        'start': start_date,
        'end': end_date,
        'format': 'JSON'
    }
    
    try:
        # print(f"   🛰️ Querying NASA: {lat}, {lon} for {year}...")
        resp = requests.get(url, params=params, timeout=20)
        resp_json = resp.json()
        return resp_json.get('properties', {}).get('parameter', {})
    except Exception as e:
        print(f"   ❌ NASA API Error: {e}")
        return None

def analyze_year(data, rules, event_type, state):
    """
    Apply "Peak Detection" logic based on rules.
    """
    param = rules['param']
    threshold = rules['val']
    op = rules['op']
    
    series = data.get(param, {})
    if not series:
        return "INCONCLUSIVE", f"No data for {param}"

    # Convert values, filtering out error codes (like -999)
    valid_values = [v for k, v in series.items() if v > -900]
    
    if not valid_values:
        return "INCONCLUSIVE", "All NASA data missing (-999)"

    # --- Annual Aggregates (Seca, Enxurrada Annual) ---
    if rules.get('annual'):
        total = sum(valid_values)
        passed = False
        if op == '>=': passed = total >= threshold
        elif op == '<=': passed = total <= threshold
        
        status = "CONFIRMED" if passed else "DOUBTFUL"
        return status, f"Annual {param}: {total:.1f} {rules['unit']} (Limit: {threshold})"

    # --- Peak / Daily Events ---
    # Find the BEST day in the year that matches the criteria
    if op == '>=':
        peak_val = max(valid_values)
        passed = peak_val >= threshold
        best_match = "Peak"
    elif op == '<=':
        peak_val = min(valid_values)
        passed = peak_val <= threshold
        best_match = "Lowest"
        
    status = "CONFIRMED" if passed else "PLAUSIBLE" # If it didn't pass strict, maybe it passed nearby?
    if not passed: status = "DOUBTFUL"
    
    return status, f"{best_match} {param}: {peak_val:.1f} {rules['unit']} (Limit: {threshold})"

def save_verdict(event_id, verdict, evidence):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # We'll re-use/abuse the truth_verdicts table or create a new V3 log
        # For now, let's just print. Or update a column if it exists.
        # Let's insert into truth_verdicts with a "V3" marker
        query = """
        INSERT INTO truth_verdicts (event_type, atlas_year, atlas_location, verdict, evidence_text)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (event_type, atlas_year, atlas_location) 
        DO UPDATE SET verdict = EXCLUDED.verdict, evidence_text = EXCLUDED.evidence_text;
        """
        # We need to map event_id back to type/year/loc for this table schema
        # Or ideally, we add a 'v3_verdict' column to disaster_events.
        # Let's stick to truth_verdicts for compatibility with the Map UI.
        pass 
    except Exception as e:
        print(e)
    conn.close()

def main():
    print("🕵️‍♂️ Truth Seeker V3: Peak Detection Engine Initiated")
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Fetch all events (Aggregate Rows)
    cur.execute("SELECT id, event_type, state_code, year FROM disaster_events")
    rows = cur.fetchall()
    conn.close()
    
    print(f"📋 Loaded {len(rows)} events to validate.")
    
    conn_save = get_db_connection()
    
    processed_states_years = {} # Cache NASA calls to avoid spamming: Key = "SP_2011"
    
    for row in rows:
        evt_id, etype, state, year = row
        
        if etype not in THRESHOLDS:
            continue
            
        rule = THRESHOLDS[etype]
        
        # 1. Check Cache
        cache_key = f"{state}_{year}"
        nasa_data = processed_states_years.get(cache_key)
        
        if not nasa_data:
            lat, lon = STATE_CENTERS.get(state, (0,0))
            if lat == 0:
                print(f"⚠️ Unknown State Center: {state}")
                continue
                
            nasa_data = fetch_nasa_data(lat, lon, year)
            if nasa_data:
                processed_states_years[cache_key] = nasa_data
            else:
                print(f"⚠️ Failed to get data for {state} {year}")
                continue
                
        # 2. Analyze
        verdict, evidence = analyze_year(nasa_data, rule, etype, state)
        
        # 3. Save
        print(f"✅ {etype} in {state} ({year}) -> {verdict} | {evidence}")
        
        # Save to DB (using the schema compatible with truth_verdicts)
        # Note: truth_verdicts uses (event_type, year, location) as unique key.
        # 'location' in V2 was the header name. Here it is the State Code.
        with conn_save.cursor() as cur_save:
            query = """
            INSERT INTO truth_verdicts (event_type, atlas_year, atlas_location, verdict, evidence_text)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (event_type, atlas_year, atlas_location) 
            DO UPDATE SET verdict = EXCLUDED.verdict, evidence_text = EXCLUDED.evidence_text;
            """
            cur_save.execute(query, (etype, year, state, verdict, f"[V3] {evidence}"))
            conn_save.commit()
            
    conn_save.close()
    print("🏁 V3 Audit Complete.")

if __name__ == "__main__":
    main()
