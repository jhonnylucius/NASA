import psycopg2

DB_CONFIG = {
    "host": "postgresql-194952-0.cloudclusters.net",
    "database": "NASA",
    "user": "luciano",
    "password": "postgresql",
    "port": "10302"
}

def list_tables():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("📊 Tables in Database:")
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = cur.fetchall()
        for t in tables:
            print(f"- {t[0]}")
            
            # Inspect columns for potential match candidates
            cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{t[0]}'")
            cols = cur.fetchall()
            print(f"  Columns: {[c[0] for c in cols]}")

        conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    list_tables()
