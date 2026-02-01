import pdfplumber
import pandas as pd
import re
import os

# Caminho do PDF (Ajustado para o seu ambiente)
PDF_PATH = r"c:\projtos pessoais\NASA\pesquisas\atlas_brasileiro_desastres_naturais.pdf"
OUTPUT_CSV = "atlas_dados_brutos.csv"

def extract_tables_from_atlas():
    print(f"🔄 Iniciando extração do arquivo: {PDF_PATH}")
    
    if not os.path.exists(PDF_PATH):
        print(f"❌ Erro: Arquivo não encontrado em {PDF_PATH}")
        return

    all_data = []

    try:
        with pdfplumber.open(PDF_PATH) as pdf:
            total_pages = len(pdf.pages)
            print(f"📄 Total de páginas encontradas: {total_pages}")
            
            # Vamos iterar por todas as páginas (pode demorar um pouco)
            current_context = "Geral" # Default context
            for i, page in enumerate(pdf.pages):
                # Feedback de progresso a cada 10 páginas
                if i % 10 == 0:
                    print(f"   ... Processando página {i+1}/{total_pages}")

                # Extrair texto para identificar contexto (Tipo de Desastre)
                text = page.extract_text() or ""
                
                # Detectar keywords de desastres (Hierarquia simples)
                # O Atlas geralmente tem capítulos claros. Ajuste conforme necessário.
                if "estiagem" in text.lower() or "seca" in text.lower():
                    current_context = "Estiagem e Seca"
                elif "inundação" in text.lower() or "inundacoes" in text.lower():
                    current_context = "Inundação"
                elif "enxurrada" in text.lower():
                    current_context = "Enxurrada"
                elif "incêndio" in text.lower() or "queimada" in text.lower():
                    current_context = "Incêndio Florestal"
                elif "movimento de massa" in text.lower() or "deslizamento" in text.lower():
                    current_context = "Movimento de Massa"
                elif "vendaval" in text.lower() or "ciclone" in text.lower():
                    current_context = "Vendaval/Ciclone"
                elif "granizo" in text.lower():
                    current_context = "Granizo"
                elif "frio" in text.lower() or "geada" in text.lower():
                    current_context = "Onda de Frio/Geada"
                # Mantém o contexto anterior se não mudar (para tabelas que ocupam várias páginas)
                
                tables = page.extract_tables()
                
                for table in tables:
                    # Lógica simples: Se tem muitas colunas, provavelmente é dado útil
                    if table and len(table[0]) > 3: 
                        # Adiciona metadados para rastreabilidade
                        for row in table:
                            row.append(i + 1) # Page Number
                            row.append(current_context) # Disaster Type detected
                            all_data.append(row)

        print(f"✅ Extração concluída! Total de linhas brutas encontradas: {len(all_data)}")

        # Salva em CSV para inspeção
        if all_data:
            df = pd.DataFrame(all_data)
            df.to_csv(OUTPUT_CSV, index=False, header=False)
            print(f"💾 Dados salvos em: {os.path.abspath(OUTPUT_CSV)}")
            print("📝 Próximo passo: Abra este CSV e verifique a estrutura para ajustarmos o script de limpeza.")
        else:
            print("⚠️ Nenhuma tabela foi encontrada. O PDF pode ser imagem (scanned) ou ter formato não tabelado.")

    except Exception as e:
        print(f"❌ Erro Crítico: {e}")

if __name__ == "__main__":
    extract_tables_from_atlas()
