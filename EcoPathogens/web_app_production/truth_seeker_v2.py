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
    'RS': 'SC_FROST_CAPITAL', # Proxy (South)
    'PR': 'SC_FROST_CAPITAL', # Proxy (South)
    'RJ': 'RJ_MOUNTAIN_REGION', # Petrópolis
    'SP': 'SP_METRO_AREA', # São Paulo
    'MG': 'RJ_MOUNTAIN_REGION', # Proxy (Southeast)
    'ES': 'RJ_MOUNTAIN_REGION', # Proxy (Southeast)
    'CE': 'NE_DROUGHT_CORE', # Sertão
    'BA': 'NE_DROUGHT_CORE', # Proxy
    'AM': 'AM_FLOOD_ZONE', # Manaus
    'PA': 'AM_FLOOD_ZONE', # Proxy
    'MA': 'NE_DROUGHT_CORE', # Proxy
    'PB': 'NE_DROUGHT_CORE', # Proxy
    'PE': 'NE_DROUGHT_CORE', # Proxy
    'RN': 'NE_DROUGHT_CORE', # Proxy
    'AL': 'NE_DROUGHT_CORE', # Proxy
    'SE': 'NE_DROUGHT_CORE', # Proxy
    'PI': 'NE_DROUGHT_CORE',  # Proxy
    'MT': 'SP_METRO_AREA', # Proxy (Center)
    'MS': 'SP_METRO_AREA', # Proxy (Center)
    'GO': 'SP_METRO_AREA', # Proxy (Center)
    'DF': 'SP_METRO_AREA', # Proxy (Center)
    'TO': 'AM_FLOOD_ZONE', # Proxy (North)
    'RO': 'AM_FLOOD_ZONE', # Proxy (North)
    'AC': 'AM_FLOOD_ZONE', # Proxy (North)
    'RR': 'AM_FLOOD_ZONE', # Proxy (North)
    'AP': 'AM_FLOOD_ZONE' # Proxy (North)
}

def get_db_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)

def save_verdict(event_type, year, location, verdict, evidence):
    conn = get_db_connection()
    query = """
    INSERT INTO truth_verdicts (event_type, atlas_year, atlas_location, verdict, evidence_text)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (event_type, atlas_year, atlas_location) 
    DO UPDATE SET verdict = EXCLUDED.verdict, evidence_text = EXCLUDED.evidence_text;
    """
    with conn.cursor() as cur:
        cur.execute(query, (event_type, year, location, verdict, evidence))
    conn.commit()
    conn.close()
    print(f"      💾 Saved: {verdict}")

# --- VALIDATION LOGIC ---

def validate_wind_event(row):
    # row: (id, event_type, state_code, year, event_date)
    _, event_type, state, year, event_date = row
    print(f"\n💨 AUDIT: {event_type} in {state} ({year})")
    
    if state not in LOCATION_MAP: return

    loc = LOCATION_MAP[state]
    # Check max wind in +/- 3 days window of event_date
    start = event_date - timedelta(days=3)
    end = event_date + timedelta(days=3)
    
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT MAX(wind_speed) FROM xavier_climate_data WHERE location_label=%s AND measure_date BETWEEN %s AND %s", (loc, start, end))
        res = cur.fetchone()
        val = float(res[0]) if res and res[0] is not None else None
    conn.close()

    if val is None: return

    if val >= 5:
        verdict = "CONFIRMED"
        evidence = f"High winds ({val} m/s) detected near {event_date}."
    elif val >= 3:
        verdict = "PLAUSIBLE"
        evidence = f"Moderate winds ({val} m/s) detected."
    else:
        verdict = "DOUBTFUL"
        evidence = f"Only light breeze ({val} m/s) recorded."
    
    save_verdict(event_type, year, state, verdict, evidence)

def validate_flood_event(row):
    # Inundação/Enxurrada/Alagamento
    _, event_type, state, year, event_date = row
    print(f"\n💧 AUDIT: {event_type} in {state} ({year})")
    
    if state not in LOCATION_MAP: return

    loc = LOCATION_MAP[state]
    # Check accumulated rain in 7 days leading up to event
    start = event_date - timedelta(days=7)
    end = event_date
    
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT SUM(precipitation) FROM xavier_climate_data WHERE location_label=%s AND measure_date BETWEEN %s AND %s", (loc, start, end))
        res = cur.fetchone()
        val = float(res[0]) if res and res[0] is not None else None
    conn.close()

    if val is None: return

    if val > 100:
        verdict = "CONFIRMED (SEVERE)"
        evidence = f"Extreme Rainfall: {val:.0f}mm in 7 days."
    elif val > 50:
        verdict = "CONFIRMED"
        evidence = f"Heavy Rainfall: {val:.0f}mm in 7 days."
    elif val > 20:
        verdict = "PLAUSIBLE"
        evidence = f"Moderate Rain: {val:.0f}mm."
    else:
        verdict = "DOUBTFUL"
        evidence = f"Dry week detected (Only {val:.0f}mm rain)."
    
    save_verdict(event_type, year, state, verdict, evidence)

def validate_hail_event(row):
    # Granizo: Needs rain + some convection checks (simplified here as Rain + Tmax)
    _, event_type, state, year, event_date = row
    print(f"\n🧊 AUDIT: {event_type} in {state} ({year})")
    
    if state not in LOCATION_MAP: return
    loc = LOCATION_MAP[state]
    
    conn = get_db_connection()
    with conn.cursor() as cur:
        # Get Precip and Max Temp on that day
        cur.execute("SELECT precipitation, t_max FROM xavier_climate_data WHERE location_label=%s AND measure_date=%s", (loc, event_date))
        res = cur.fetchone()
        precip = float(res[0]) if res and res[0] is not None else 0
        tmax = float(res[1]) if res and res[1] is not None else 0
    conn.close()

    if precip > 5:
        verdict = "PLAUSIBLE"
        evidence = f"Rain ({precip}mm) + Temp ({tmax}°C) consistent with storm."
        if precip > 30:
            verdict = "CONFIRMED"
            evidence = f"Heavy Storm ({precip}mm) likely generated hail."
    else:
        verdict = "DOUBTFUL"
        evidence = f"No rain recorded ({precip}mm). Hail unlikely."
    
    save_verdict(event_type, year, state, verdict, evidence)

def validate_fire_event(row):
    # Incêndio: Low Humidity + High Temp
    _, event_type, state, year, event_date = row
    print(f"\n🔥 AUDIT: {event_type} in {state} ({year})")
    
    if state not in LOCATION_MAP: return
    loc = LOCATION_MAP[state]
    
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT humidity, t_max FROM xavier_climate_data WHERE location_label=%s AND measure_date=%s", (loc, event_date))
        res = cur.fetchone()
        humid = float(res[0]) if res and res[0] is not None else 100
        tmax = float(res[1]) if res and res[1] is not None else 0
    conn.close()

    if humid < 50 and tmax > 28:
        verdict = "CONFIRMED"
        evidence = f"Fire Weather: Low Humidity ({humid}%) + Hot ({tmax}°C)."
    elif humid < 60:
        verdict = "PLAUSIBLE"
        evidence = f"Dry conditions ({humid}% RH)."
    else:
        verdict = "DOUBTFUL"
        evidence = f"Too humid ({humid}%) for natural fire."
    
    # Override for User's RED FLAG request (Show we can audit it anyway)
    save_verdict(event_type, year, state, verdict, evidence)

def validate_cold_event(row):
    # Geada: Low T_min
    _, event_type, state, year, event_date = row
    print(f"\n❄️ AUDIT: {event_type} in {state} ({year})")
    
    if state not in LOCATION_MAP: return
    loc = LOCATION_MAP[state]
    
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT MIN(t_min) FROM xavier_climate_data WHERE location_label=%s AND measure_date=%s", (loc, event_date))
        res = cur.fetchone()
        val = float(res[0]) if res and res[0] is not None else None
    conn.close()

    if val is None: return

    if val <= 3:
        verdict = "CONFIRMED"
        evidence = f"Freezing conditions ({val}°C)."
    elif val <= 6:
        verdict = "PLAUSIBLE"
        evidence = f"Cold snap ({val}°C)."
    else:
        verdict = "DOUBTFUL"
        evidence = f"Too warm ({val}°C) for frost."
    
    save_verdict(event_type, year, state, verdict, evidence)

def validate_drought_history():
    print(f"\n☀️ NE DROUGHT HISTORICAL AUDIT (1975-2023)...")
    loc_label = 'NE_DROUGHT_CORE'
    conn = get_db_connection()
    
    for year in range(1975, 2024):
        start = date(year, 1, 1)
        end = date(year, 12, 31)
        with conn.cursor() as cur:
            cur.execute("SELECT SUM(precipitation) FROM xavier_climate_data WHERE location_label=%s AND measure_date BETWEEN %s AND %s", (loc_label, start, end))
            res = cur.fetchone()
            total = float(res[0]) if res and res[0] is not None else None
        
        if total is not None:
            if total < 500:
                verdict = "CONFIRMED (SEVERE)"
                evidence = f"Extreme Drought ({total:.0f}mm)."
            elif total < 700:
                verdict = "CONFIRMED"
                evidence = f"Drought Year ({total:.0f}mm)."
            else:
                verdict = "NORMAL"
                evidence = f"Normal Rain ({total:.0f}mm)."
            save_verdict("Estiagem e Seca", year, "NE (Sertão)", verdict, evidence)
    conn.close()

def main():
    print("🕵️‍♂️ TRUTH ENGINE V3 (ALL HAZARDS)...")
    
    conn = get_db_connection()
    cur = conn.cursor()
    # Get all events from the Master Table
    cur.execute("SELECT id, event_type, state_code, year, event_date FROM disaster_events")
    events = cur.fetchall()
    conn.close()

    for row in events:
        etype = row[1]
        if etype in ['Vendaval', 'Tornado']:
            validate_wind_event(row)
        elif etype in ['Inundação', 'Enxurrada', 'Alagamento']:
            validate_flood_event(row)
        elif etype == 'Granizo':
            validate_hail_event(row)
        elif etype == 'Geada':
            validate_cold_event(row)
        elif etype == 'Incêndio Florestal':
            validate_fire_event(row)
        # Moviment de Massa skipped (too complex for just simple climate vars)
    
    # Run the Drought Year Loop separately (as it's year-based, not event-based)
    validate_drought_history()
    
    # NEW: Validate Aggregate Tables (Tornado, Enxurrada, Alagamento)
    validate_tornado_history()
    validate_flash_flood_history()
    validate_urban_flood_history()
    
    print("🏁 V3 Audit Complete.")

def validate_tornado_history():
    """Validate yearly tornado counts against wind speed data."""
    print(f"\n🌪️ AUDITING: Tornado History (Yearly)...")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT year, occurrences FROM tornado_history_stats WHERE occurrences > 0")
    years = cur.fetchall()
    
    for year, occ in years:
        # Check max wind in Sul (where 98% of tornadoes occur)
        loc = 'SC_FROST_CAPITAL'
        start = date(year, 1, 1)
        end = date(year, 12, 31)
        cur.execute("SELECT MAX(wind_speed) FROM xavier_climate_data WHERE location_label=%s AND measure_date BETWEEN %s AND %s", (loc, start, end))
        res = cur.fetchone()
        max_wind = float(res[0]) if res and res[0] else None
        
        if max_wind:
            if max_wind >= 5:
                verdict = "CONFIRMED"
                evidence = f"{occ} tornados. Wind peaks ({max_wind} m/s) support this."
            else:
                verdict = "PLAUSIBLE"
                evidence = f"{occ} reported. Winds ({max_wind} m/s) moderate - localized gusts likely."
            save_verdict("Tornado", year, "Brasil (Sul)", verdict, evidence)
    conn.close()

def validate_flash_flood_history():
    """Validate yearly flash flood (Enxurrada) counts against rain data."""
    print(f"\n🌊 AUDITING: Enxurrada History (Yearly)...")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT year, occurrences FROM flash_flood_history_stats WHERE occurrences > 0")
    years = cur.fetchall()
    
    for year, occ in years:
        # Check max rainfall in Sul/Sudeste (main flash flood regions)
        loc = 'SP_METRO_AREA'
        start = date(year, 1, 1)
        end = date(year, 12, 31)
        cur.execute("SELECT SUM(precipitation) FROM xavier_climate_data WHERE location_label=%s AND measure_date BETWEEN %s AND %s", (loc, start, end))
        res = cur.fetchone()
        total_rain = float(res[0]) if res and res[0] else None
        
        if total_rain:
            # Brazil avg ~1500mm. High years support flash floods.
            if total_rain > 1600:
                verdict = "CONFIRMED"
                evidence = f"{occ} enxurradas. Heavy year ({total_rain:.0f}mm)."
            elif total_rain > 1200:
                verdict = "PLAUSIBLE"
                evidence = f"{occ} reported. Normal rain ({total_rain:.0f}mm)."
            else:
                verdict = "DOUBTFUL"
                evidence = f"{occ} reported but dry year ({total_rain:.0f}mm)."
            save_verdict("Enxurrada", year, "Brasil (SE/S)", verdict, evidence)
    conn.close()

def validate_urban_flood_history():
    """Validate yearly urban flood (Alagamento) counts against rain data."""
    print(f"\n🏙️ AUDITING: Alagamento History (Yearly)...")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT year, occurrences FROM urban_flood_history_stats WHERE occurrences > 0")
    years = cur.fetchall()
    
    for year, occ in years:
        loc = 'SP_METRO_AREA'  # Urban floods dominated by Sudeste
        start = date(year, 1, 1)
        end = date(year, 12, 31)
        cur.execute("SELECT SUM(precipitation) FROM xavier_climate_data WHERE location_label=%s AND measure_date BETWEEN %s AND %s", (loc, start, end))
        res = cur.fetchone()
        total_rain = float(res[0]) if res and res[0] else None
        
        if total_rain:
            if total_rain > 1500:
                verdict = "CONFIRMED"
                evidence = f"{occ} alagamentos. High rainfall ({total_rain:.0f}mm)."
            else:
                verdict = "PLAUSIBLE"
                evidence = f"{occ} reported. Rain ({total_rain:.0f}mm) - drainage issues likely."
            save_verdict("Alagamento", year, "Brasil (Urbano)", verdict, evidence)
    conn.close()

if __name__ == "__main__":
    main()
