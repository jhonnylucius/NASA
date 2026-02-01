import psycopg2
conn = psycopg2.connect(host='postgresql-194952-0.cloudclusters.net', database='NASA', user='luciano', password='postgresql', port='10302')
cur = conn.cursor()
query = """
SELECT 
    location_label, 
    COUNT(*) as total_rows,
    COUNT(precipitation) as count_precip,
    COUNT(t_min) as count_tmin,
    COUNT(t_max) as count_tmax,
    COUNT(wind_speed) as count_wind,
    COUNT(radiation) as count_rad
FROM xavier_climate_data 
GROUP BY location_label
"""
cur.execute(query)
rows = cur.fetchall()

print(f"{'Location':<20} | {'Rows':<7} | {'Precip':<7} | {'Tmin':<7} | {'Tmax':<7} | {'Wind':<7} | {'Rad':<7}")
print("-" * 80)
for r in rows:
    print(f"{r[0]:<20} | {r[1]:<7} | {r[2]:<7} | {r[3]:<7} | {r[4]:<7} | {r[5]:<7} | {r[6]:<7}")

conn.close()
