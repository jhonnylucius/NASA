import psycopg2
from datetime import datetime

# DB Config
DB_HOST = "postgresql-194952-0.cloudclusters.net"
DB_PORT = "10302"
DB_NAME = "NASA"
DB_USER = "luciano"
DB_PASS = "postgresql"

def get_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)

def generate_report():
    print("🚑 Generating Human Impact Report...")
    conn = get_connection()
    cur = conn.cursor()
    
    # 1. Total Impact from 'human_damages' (The Master Table)
    query = """
    SELECT 
        SUM(deaths) as total_deaths,
        SUM(injured) as total_injured,
        SUM(sick) as total_sick,
        SUM(homeless) as total_homeless,
        SUM(displaced) as total_displaced,
        SUM(others) as total_others,
        SUM(affected) as total_affected
    FROM human_damages
    """
    
    try:
        cur.execute(query)
        result = cur.fetchone()
        
        deaths, injured, sick, homeless, displaced, others, affected = result
        
        # Handle None
        deaths = int(deaths or 0)
        injured = int(injured or 0)
        sick = int(sick or 0)
        homeless = int(homeless or 0)
        displaced = int(displaced or 0)
        others = int(others or 0)
        affected = int(affected or 0)
        
        total_lives = affected + deaths + injured + sick + homeless + displaced + others
        
        print("\n=== 🆘 RELATÓRIO DE IMPACTO HUMANO 🆘 ===")
        print(f"⚰️  MORTOS:       {deaths:,} vidas perdidas")
        print(f"🤕  FERIDOS:      {injured:,}")
        print(f"🤢  ENFERMOS:     {sick:,}")
        print(f"🏚️  DESABRIGADOS: {homeless:,}")
        print(f"🚶  DESALOJADOS:  {displaced:,}")
        print(f"👥  AFETADOS:     {affected:,}")
        print(f"➕  OUTROS:       {others:,}")
        print("---------------------------------------")
        print(f"TOTAL GERAL IMPACTADO: {total_lives:,}")
        print("=======================================\n")
        
    except Exception as e:
        print(f"❌ Error getting totals: {e}")

    # 2. Check for "Top Killer Events" (if individual rows exist)
    try:
        cur.execute("SELECT location, deaths, year FROM gale_mortality_events ORDER BY deaths DESC LIMIT 5")
        top_killers = cur.fetchall()
        if top_killers:
            print("⚠️ MAIORES EVENTOS DE MORTALIDADE (VENDAVAL):")
            for loc, d, y in top_killers:
                print(f"   - {loc} ({y}): {d} mortes")
    except:
        pass # Maybe table structure differs

    conn.close()

if __name__ == "__main__":
    generate_report()
