import os
import glob
import numpy as np
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import subprocess
import sys

# --- CONFIGURATION ---
DATA_DIR = r"c:\projtos pessoais\NASA\EcoPathogens\web_app_production\etl\xavier_data"
DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_PORT = "10302"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"

# Target Locations ("The Disaster Capitals")
LOCATIONS = {
    'SC_FROST_CAPITAL': (-27.8167, -50.3261),       # Lages/São Joaquim
    'RJ_MOUNTAIN_REGION': (-22.5050, -43.1788),     # Petrópolis
    'SP_METRO_AREA': (-23.5505, -46.6333),          # São Paulo
    'NE_DROUGHT_CORE': (-7.5343, -39.0614),         # Sertão Central
    'AM_FLOOD_ZONE': (-3.1190, -60.0217),           # Manaus
}

# Variable Mapping
VAR_MAP = {
    'pr': 'precipitation',
    'Tmin': 't_min',
    'Tmax': 't_max',
    'u2': 'wind_speed',
    'RH': 'humidity',
    'Rs': 'radiation'
}

def install_dependencies():
    """Auto-install dependencies"""
    required = ['numpy', 'pandas', 'xarray', 'netCDF4']
    try:
        import numpy, pandas, xarray, netCDF4
        print("✅ Dependencies available.")
    except ImportError:
        print("📦 Installing dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + required)

def get_db_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)

# --- HELPER: Find DB Column from Filename ---
def identify_variable(filename):
    # Check for exact .npz match first (e.g. pr.npz)
    base = os.path.basename(filename)
    if base in [f"{k}.npz" for k in VAR_MAP]:
        return VAR_MAP[base.replace('.npz', '')]
    
    # Check for prefix match (e.g. pr_1980_...nc)
    for key in VAR_MAP:
        if base.startswith(key + '_') or base.startswith(key + '.'):
             return VAR_MAP[key]
    return None

# --- STRATEGY 1: PROCESS .NPZ (STATIONS) ---
def process_npz(filepath, db_column):
    print(f"   🔹 Processing as NumPy Archive (.npz)...")
    try:
        npz = np.load(filepath)
        data_matrix = npz['data']
        coords = npz['lat_lon_alt']
        
        # Date generation (Hardcoded range from README or dynamic?)
        # README says 1961-01-01 to 2024-03-20 for .npz
        # We'll try to match matrix size
        n_days = data_matrix.shape[0]
        date_index = pd.date_range("1961-01-01", periods=n_days, freq='D')
        
        all_records = []
        for loc_label, (target_lat, target_lon) in LOCATIONS.items():
            # Euclidean Distance for Nearest Station
            dists = np.sqrt((coords[:, 0] - target_lat)**2 + (coords[:, 1] - target_lon)**2)
            idx = np.argmin(dists)
            dist = dists[idx]

            if dist > 0.5:
                print(f"      ⚠️ Nearest station for {loc_label} is {dist:.2f} deg away.")

            series = data_matrix[:, idx]
            
            # Build DataFrame
            df = pd.DataFrame({'date': date_index, 'value': series})
            df = df.dropna()
            
            current_records = [
                (loc_label, row.date.strftime('%Y-%m-%d'), float(row.value))
                for row in df.itertuples(index=False)
            ]
            all_records.extend(current_records)
            
        return all_records
    except Exception as e:
        print(f"      ❌ Error reading NPZ: {e}")
        return []

# --- STRATEGY 2: PROCESS .NC (GRID) ---
def process_nc(filepath, db_column):
    print(f"   🔹 Processing as NetCDF Grid (.nc)...")
    try:
        import xarray as xr
        ds = xr.open_dataset(filepath)
        all_records = []
        
        # Identify Data Var (usually the first one that isn't lat/lon/time)
        data_var = None
        for v in ds.data_vars:
            if v not in ['time', 'latitude', 'longitude', 'lat', 'lon', 'elevation']:
                data_var = v
                break
        
        if not data_var:
            print("      ⚠️ No data variable found in NetCDF.")
            return []

        for loc_label, (target_lat, target_lon) in LOCATIONS.items():
            try:
                # Nearest Neighbor extraction
                # Try standard names
                if 'latitude' in ds.coords:
                    sel_dict = {'latitude': target_lat, 'longitude': target_lon}
                elif 'lat' in ds.coords:
                    sel_dict = {'lat': target_lat, 'lon': target_lon}
                else:
                    print("      ⚠️ Could not find lat/lon coords in NetCDF.")
                    continue
                    
                pixel = ds.sel(sel_dict, method='nearest')
                ts = pixel[data_var].to_series()
                
                for date_val, value in ts.items():
                    if pd.isna(value): continue
                    all_records.append((loc_label, date_val.strftime('%Y-%m-%d'), float(value)))
                    
            except Exception as e:
                print(f"      ❌ Error extracting {loc_label}: {e}")
                
        ds.close()
        return all_records
    except Exception as e:
        print(f"      ❌ Error reading NetCDF: {e}")
        return []

def upsert_data(records, column_name):
    query = f"""
    INSERT INTO xavier_climate_data (location_label, measure_date, {column_name})
    VALUES %s
    ON CONFLICT (location_label, measure_date)
    DO UPDATE SET {column_name} = EXCLUDED.{column_name};
    """
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        batch_size = 5000
        for i in range(0, len(records), batch_size):
            batch = records[i:i+batch_size]
            execute_values(cur, query, batch)
            conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"      ❌ DB Error: {e}")
    finally:
        conn.close()

def main():
    print("🚀 Starting Universal Xavier Ingestor...")
    install_dependencies()
    
    if not os.path.exists(DATA_DIR):
        print(f"❌ Directory missing: {DATA_DIR}")
        return

    # Recursive Search for both types
    files = glob.glob(os.path.join(DATA_DIR, "**", "*.npz"), recursive=True) + \
            glob.glob(os.path.join(DATA_DIR, "**", "*.nc"), recursive=True)
            
    if not files:
        print("⚠️ No .npz or .nc files found.")
        return

    print(f"📦 Found {len(files)} files. Processing...")
    
    for f in files:
        fname = os.path.basename(f)
        if "Control" in fname:
            print(f"⏭️ Skipping Control file: {fname}")
            continue
            
        col = identify_variable(fname)
        if not col:
            print(f"⏭️ Skipping {fname}: Unknown variable.")
            continue
            
        print(f"📂 Processing {fname} -> {col}")
        
        records = []
        if f.endswith('.npz'):
            records = process_npz(f, col)
        elif f.endswith('.nc'):
            records = process_nc(f, col)
            
        if records:
            print(f"      💾 Upserting {len(records)} records...")
            upsert_data(records, col)
        else:
            print("      ⚠️ No data retrieved.")

    print("🏁 Ingestion Complete.")

if __name__ == "__main__":
    main()
