import pdfplumber

PDF_PATH = "c:\\projtos pessoais\\NASA\\pesquisas\\atlas_brasileiro_desastres_naturais.pdf"

# Paginas citadas pelo usuario (approx, pois PDF pode ter offset de capa)
# Tabela 1: Inundação (pg 53)
# Tabela 2: Vendavais (pg 68)
# Tabela 8: Erosões (pg 91)
# Estiagem (pg 40 map, tabela deve estar perto)

PAGES_TO_INSPECT = [53, 68, 91, 40, 46, 52] 

def inspect():
    with pdfplumber.open(PDF_PATH) as pdf:
        for pg_num in PAGES_TO_INSPECT:
            # pdfplumber é 0-indexed, mas numeros do usuario sao 1-indexed (book pagination)
            # Geralmente book pg 1 != pdf page 1. Vamos tentar offset.
            # Se o PDF tem capa, sumario, etc, offset pode ser ~10 a 20 paginas.
            # Vamos ler paginas ao redor
            
            print(f"\n--- INSPECTING PDF PAGE {pg_num} (Raw Index {pg_num-1}) ---")
            try:
                page = pdf.pages[pg_num-1] # Tenta indice direto
                text = page.extract_text()
                tables = page.extract_tables()
                
                print(f"HEADER/TEXT START: {text[:200] if text else 'NO TEXT'}")
                print(f"TABLES FOUND: {len(tables)}")
                if tables:
                    print("FIRST ROW OF FIRST TABLE:", tables[0][0])
            except IndexError:
                print("Page index out of range")

if __name__ == "__main__":
    inspect()
