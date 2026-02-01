import psycopg2
from datetime import date

# DB Config
DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_PORT = "10302"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"

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

def validate_tornado_history():
    """Validate yearly tornado counts against wind speed data."""
    print(f"\n🌪️ AUDITING: Tornado History (Yearly)...")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT year, occurrences FROM tornado_history_stats WHERE occurrences > 0")
    years = cur.fetchall()
    
    for year, occ in years:
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
                evidence = f"{occ} reported. Winds ({max_wind} m/s) moderate."
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
        loc = 'SP_METRO_AREA'
        start = date(year, 1, 1)
        end = date(year, 12, 31)
        cur.execute("SELECT SUM(precipitation) FROM xavier_climate_data WHERE location_label=%s AND measure_date BETWEEN %s AND %s", (loc, start, end))
        res = cur.fetchone()
        total_rain = float(res[0]) if res and res[0] else None
        
        if total_rain:
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
        loc = 'SP_METRO_AREA'
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
    print("🎯 RUNNING ONLY NEW AUDITS (Tornado, Enxurrada, Alagamento)...")
    validate_tornado_history()
    validate_flash_flood_history()
    validate_urban_flood_history()
    print("🏁 Done! Check truth_verdicts for new entries.")
