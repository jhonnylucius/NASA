import psycopg2

DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_PORT = "10302"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"

def inspect():
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)
        cur = conn.cursor()
        
        # English + Portuguese roots
        keywords = [
            'death', 'mort', 'obit', 
            'injur', 'ferid', 
            'sick', 'enferm', 
            'homeless', 'desabrig', 
            'displac', 'desaloj', 
            'affect', 'afetad', 
            'other', 'outros'
        ]
        
        print(f"--- Searching for columns matching: {keywords} ---")
        
        combined_clause = " OR ".join([f"column_name ILIKE '%{k}%'" for k in keywords])
        query = f"SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' AND ({combined_clause})"
        
        cur.execute(query)
        matches = cur.fetchall()
        
        for table, col in matches:
            print(f"FOUND: {table}.{col}")

        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect()
