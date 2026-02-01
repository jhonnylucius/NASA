import psycopg2

DB_CONFIG = {
    "host": "postgresql-194952-0.cloudclusters.net",
    "database": "NASA",
    "user": "luciano",
    "password": "postgresql",
    "port": "10302"
}

def reset():
    print("🧹 Cleaning Database Tables...")
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Truncate main tables
        cur.execute("TRUNCATE TABLE disaster_events CASCADE")
        print("✅ disaster_events truncated.")
        
        # Try truncate seasonality if exists
        try:
            cur.execute("TRUNCATE TABLE disaster_seasonality CASCADE")
            print("✅ disaster_seasonality truncated.")
        except:
            print("⚠️ disaster_seasonality probably doesn't exist yet (skipping).")
            conn.rollback() # Important if error occurred
            
        conn.commit()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    reset()
