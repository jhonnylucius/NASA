import psycopg2
import pandas as pd
from match_engine import fetch_nasa_power_data, LOCATIONS
from datetime import date, timedelta

# DB Config
DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_PORT = "10302"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"

def get_db_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)

def get_xavier_data(location_label, start_date, end_date):
    """Fetch Ground Truth from local DB"""
    conn = get_db_connection()
    query = """
    SELECT measure_date, t_min, precipitation 
    FROM xavier_climate_data 
    WHERE location_label = %s AND measure_date BETWEEN %s AND %s
    ORDER BY measure_date
    """
    df = pd.read_sql_query(query, conn, params=(location_label, start_date, end_date))
    conn.close()
    return df

def calibrate(location_label, test_year, event_type):
    print(f"⚖️  CALIBRATION TEST: {location_label} ({test_year}) - {event_type}")
    
    start_date = date(test_year, 6, 1) # Winter/Dry Season Sample
    end_date = date(test_year, 6, 30)  # 1 Month sample
    
    # 1. Get Ground Truth (Xavier)
    print("   ↳ Fetching Xavier data (Ground Truth)...")
    df_xavier = get_xavier_data(location_label, start_date, end_date)
    
    if df_xavier.empty:
        print("   ⚠️ No Xavier data found for this period. Ingestion might be incomplete.")
        return

    # 2. Get Satellite Data (NASA)
    lat, lon = LOCATIONS[location_label]
    print(f"   ↳ Fetching NASA data (Satellite) for {lat}, {lon}...")
    nasa_json = fetch_nasa_power_data(lat, lon, start_date, end_date)
    
    if not nasa_json:
        print("   ❌ Failed to fetch NASA data.")
        return

    # 3. Compare
    print("\n   📊 COMPARISON REPORT (June " + str(test_year) + "):")
    print("   Date       | Xavier Tmin | NASA Tmin | Tmin Bias | Xavier Precip | NASA Precip | Precip Bias")
    print("   -----------|-------------|-----------|-----------|---------------|-------------|------------")
    
    tmin_biases = []
    precip_biases = []
    
    nasa_props = nasa_json['properties']['parameter']
    
    for index, row in df_xavier.iterrows():
        d_str = row['measure_date'].strftime('%Y%m%d')
        d_disp = row['measure_date'].strftime('%Y-%m-%d')
        
        xavier_tmin = row['t_min']
        xavier_precip = row['precipitation']
        
        # NASA keys are YYYYMMDD
        nasa_tmin = nasa_props['T2M_MIN'].get(d_str, -999)
        nasa_precip = nasa_props['PRECTOTCORR'].get(d_str, -999)
        
        if nasa_tmin == -999: continue
        
        tmin_diff = nasa_tmin - float(xavier_tmin)
        precip_diff = nasa_precip - float(xavier_precip)
        
        tmin_biases.append(tmin_diff)
        precip_biases.append(precip_diff)
        
        print(f"   {d_disp} | {xavier_tmin:6.2f}      | {nasa_tmin:6.2f}    | {tmin_diff:+5.2f}°C   | {xavier_precip:6.2f}        | {nasa_precip:6.2f}      | {precip_diff:+5.2f}mm")

    if tmin_biases:
        avg_bias_tmin = sum(tmin_biases) / len(tmin_biases)
        avg_bias_precip = sum(precip_biases) / len(precip_biases)
        
        print("\n   🏁 CONCLUSION:")
        print(f"   🌡️ Temperature: NASA is on average {avg_bias_tmin:+.2f}°C relative to Ground Truth.")
        print(f"   🌧️ Precipitation: NASA is on average {avg_bias_precip:+.2f}mm relative to Ground Truth.")
        
        if abs(avg_bias_tmin) > 2.0:
            print("   ⚠️ LARGE TEMPERATURE BIAS DETECTED. Calibration recommended.")
        else:
            print("   ✅ Temperature data is reasonably aligned.")

if __name__ == "__main__":
    # Test Case: Frost in SC (Winter 2010 - High data availability check)
    calibrate('SC_FROST_CAPITAL', 2005, 'Frost Check')
