-- Schema para Importação do Atlas Brasileiro de Desastres Naturais
-- Autor: EcoPathogens AI Assistant
-- Data: 2026-01-01

-- 1. Tabela Principal de Eventos
-- Armazena o "O Que, Onde e Quando" de cada desastre histórico.
CREATE TABLE IF NOT EXISTS disaster_events (
    id BIGSERIAL PRIMARY KEY,
    -- Taxonomia Oficial do Atlas (11 Tipos)
    -- Importante: A aplicação deve enviar exatamente estas Strings
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'Estiagem e Seca', 
        'Enxurrada', 
        'Inundação', 
        'Alagamento', 
        'Vendaval', 
        'Granizo', 
        'Movimento de Massa', 
        'Erosão', 
        'Incêndio Florestal', 
        'Tornado', 
        'Geada',
        'Dados Agregados'
    )),
    municipality_code VARCHAR(10),   -- Código IBGE (Vital para cruzar com SUS/Gov)
    municipality_name VARCHAR(100),
    state_code CHAR(2),              -- AC, SP, etc.
    event_date DATE NOT NULL,
    year INT NOT NULL,
    
    -- Metadados de rastreabilidade
    source_document VARCHAR(100) DEFAULT 'Atlas Brasileiro 1991-2012',
    page_number INT,                 -- Para auditoria: de qual página do PDF saiu este dado
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para buscas rápidas (Performance)
CREATE INDEX IF NOT EXISTS idx_disaster_mun_date ON disaster_events(municipality_code, event_date);
CREATE INDEX IF NOT EXISTS idx_disaster_type ON disaster_events(event_type);
CREATE INDEX IF NOT EXISTS idx_disaster_year ON disaster_events(year);

-- 2. Tabela de Danos Humanos (Foco na Saúde & Impacto Social)
-- Aqui vive a inteligência do EcoPathogens: monitorar Enfermos e Desaparecidos
CREATE TABLE IF NOT EXISTS human_damages (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES disaster_events(id) ON DELETE CASCADE,
    
    deaths INT DEFAULT 0,            -- Óbitos imediatos
    injured INT DEFAULT 0,           -- Feridos (Trauma físico)
    sick INT DEFAULT 0,              -- Enfermos (Doenças decorrentes - Métrica Chave EcoPathogens)
    disappeared INT DEFAULT 0,       -- Desaparecidos (Nova métrica identificada nos gráficos)
    homeless INT DEFAULT 0,          -- Desabrigados (Dependem de abrigo público)
    displaced INT DEFAULT 0,         -- Desalojados (Casa de parentes/vizinhos)
    affected INT DEFAULT 0,          -- Total geral de afetados
    others INT DEFAULT 0
);

-- 3. Tabela de Prejuízos Econômicos (Placeholder para Fase 3)
-- Estrutura pronta para receber dados financeiros futuros
CREATE TABLE IF NOT EXISTS economic_losses (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES disaster_events(id) ON DELETE CASCADE,
    
    houses_destroyed INT DEFAULT 0,
    houses_damaged INT DEFAULT 0,
    
    -- Valores Monetários (Para provar o ROI do projeto)
    public_infrastructure_loss NUMERIC(15, 2), -- Pontes, estradas, escolas
    health_system_cost NUMERIC(15, 2),         -- Estimativa de custo SUS (Fase 3)
    total_estimated_loss NUMERIC(15, 2)
);

-- 4. Tabela de Sazonalidade (Frequência Mensal)
-- Permite entender QUANDO os eventos ocorrem (Vigilância Preventiva)
CREATE TABLE IF NOT EXISTS disaster_seasonality (
    id BIGSERIAL PRIMARY KEY,
    -- Tipo do Desastre (Normalizado)
    event_type VARCHAR(50) NOT NULL,
    month_name VARCHAR(20) NOT NULL, -- Janeiro, Fevereiro...
    
    -- Ocorrências por Região (Dados do Atlas)
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    
    brasil_total INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Estatísticas Gerais Anuais (Dados Agregados Manuais)
-- Usado para gráficos de tendência macros (ex: % de desastres por ano)
CREATE TABLE IF NOT EXISTS annual_general_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    percentage NUMERIC(5, 2), -- Ex: 10.5
    total_events_estimated INT, -- Opcional, se calcularmos baseados no %
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Comparativo de Décadas (Gráfico 2)
-- Mostra a evolução (explosão) dos desastres da década de 90 para 2000
CREATE TABLE IF NOT EXISTS decadal_comparison_stats (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    pct_1990s INT NOT NULL, -- Porcentagem na década de 90
    pct_2000s INT NOT NULL, -- Porcentagem na década de 2000
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Taxa de Crescimento entre Décadas (Gráfico 3)
-- Mostra o fator de multiplicação (ex: aumentou 21.7x)
CREATE TABLE IF NOT EXISTS disaster_growth_stats (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    growth_factor NUMERIC(5, 1), -- Ex: 21.7, 2.7
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Mortalidade por Tipo de Desastre (Gráfico 5)
-- Distribuição de óbitos (Enxurradas matam mais que todos os outros somados)
CREATE TABLE IF NOT EXISTS disaster_mortality_stats (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 58.15
    created_at TIMESTAMP DEFAULT NOW()
);

-- 9. População Afetada por Tipo de Desastre (Gráfico 4)
-- Total Base: 126.926.656 pessoas (1991-2012)
CREATE TABLE IF NOT EXISTS disaster_affected_stats (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 51.31
    estimated_people BIGINT,  -- Calculado (Total * %)
    created_at TIMESTAMP DEFAULT NOW()
);

-- 10. Mortalidade e Afetados por Região (Gráfico 6)
-- Mostra a disparidade regional: Nordeste tem mais afetados (Seca), Sudeste tem mais mortos (Deslizamentos/Enchentes)
CREATE TABLE IF NOT EXISTS regional_impact_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL, -- N, NE, CO, SE, S
    deaths_percentage NUMERIC(5, 2), -- % de Mortos
    affected_percentage NUMERIC(5, 2), -- % de Afetados
    created_at TIMESTAMP DEFAULT NOW()
);

-- 11. Letalidade Regional (Gráfico 7)
-- Compara Ocorrências vs Mortes por Milhão (Indica onde o desastre é mais letal)
CREATE TABLE IF NOT EXISTS regional_lethality_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    deaths_per_million NUMERIC(5, 2), -- Ex: 28.5
    occurrences_value NUMERIC(5, 2),  -- Valor de referência das ocorrências
    created_at TIMESTAMP DEFAULT NOW()
);

-- 12. Sazonalidade Mensal por Região (Gráfico 9)
-- Mostra quando os desastres ocorrem em cada região (Janeiro = Chuva no Sul/Sudeste, Seca no NE?)
CREATE TABLE IF NOT EXISTS annual_seasonality_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name CHAR(3) NOT NULL, -- Jan, Fev...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 13. Evolução Anual de Ocorrências (Gráfico 10)
-- Série temporal detalhada das linhas do gráfico (Estiagem vs Inundação vs Enxurrada)
CREATE TABLE IF NOT EXISTS annual_occurrence_trends (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    drought_count INT DEFAULT 0,      -- Estiagem e Seca
    flash_flood_count INT DEFAULT 0,  -- Enxurrada
    flood_count INT DEFAULT 0,        -- Inundação
    others_count INT DEFAULT 0,       -- Outros aglomerados
    created_at TIMESTAMP DEFAULT NOW()
);

-- 14. Distribuição de Seca por Região (Gráfico 11)
-- Mostra onde a seca se concentra (spoiler: 56% no Nordeste)
CREATE TABLE IF NOT EXISTS drought_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 56.68
    created_at TIMESTAMP DEFAULT NOW()
);

-- 15. Sazonalidade de Seca por Região (Gráfico 12)
-- Especificamente para ESTIAGEM E SECA (Diferente da sazonalidade geral)
CREATE TABLE IF NOT EXISTS drought_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name CHAR(3) NOT NULL, -- Jan, Fev...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 16. Perfil de Danos Regionais (Gráfico 13 e outros)
-- Detalhamento absoluto de vítimas (Afetados, Enfermos, Feridos...) por Região e Tipo
CREATE TABLE IF NOT EXISTS regional_damage_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL, -- Norte, Nordeste...
    event_type VARCHAR(50) NOT NULL,  -- Estiagem e Seca, etc.
    affected INT DEFAULT 0,
    sick INT DEFAULT 0,        -- Enfermos
    injured INT DEFAULT 0,     -- Feridos
    displaced INT DEFAULT 0,   -- Desalojados
    homeless INT DEFAULT 0,    -- Desabrigados
    dead INT DEFAULT 0,        -- Mortos
    missing INT DEFAULT 0,     -- Desaparecidos
    others INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 17. Série Histórica de Estiagem e Seca (Gráfico 18)
-- Dados precisos focados apenas na Seca (Fonte melhorada em relação ao Gráfico 10)
CREATE TABLE IF NOT EXISTS drought_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 18. Distribuição de Enxurradas por Região (Gráfico 19)
-- Sul lidera com 39%, mostrando o extremo oposto da Seca (Nordeste)
CREATE TABLE IF NOT EXISTS flash_flood_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 39.00
    created_at TIMESTAMP DEFAULT NOW()
);

-- 19. Sazonalidade de Enxurradas por Região (Gráfico 20)
-- Mostra quando as enxurradas ocorrem (Sudeste concentrado no Verão, Sul distribuído)
CREATE TABLE IF NOT EXISTS flash_flood_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name CHAR(3) NOT NULL, -- Jan, Fev...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 20. Série Histórica de Enxurradas (Gráfico 26)
-- Contraparte da Seca. Permite cruzar dados temporais (Seca sobe, Enxurrada desce?)
CREATE TABLE IF NOT EXISTS flash_flood_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 21. Distribuição de Inundações por Região (Gráfico 27)
-- Inundação (Gradual) vs Enxurrada (Súbita). Sudeste lidera ambas, mas o perfil muda no Sul/NE.
CREATE TABLE IF NOT EXISTS flood_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 34.00
    created_at TIMESTAMP DEFAULT NOW()
);

-- 22. Ocorrências de Inundação por Estado (Tabela 1)
-- Granularidade Estadual (UF). Permite mapas de calor por estado.
-- Total esperado: 4.691 ocorrências.
CREATE TABLE IF NOT EXISTS state_flood_stats (
    id BIGSERIAL PRIMARY KEY,
    state_code CHAR(2) NOT NULL, -- UF
    region_name VARCHAR(50) NOT NULL,
    mesoregions_affected INT DEFAULT 0,
    municipalities_affected INT DEFAULT 0,
    occurrences INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 23. Sazonalidade de Inundações por Região (Gráfico 28)
-- Mostra Inundação Gradual mês a mês. SE explode em Jan, NE em Abril.
CREATE TABLE IF NOT EXISTS flood_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name CHAR(3) NOT NULL, -- Jan, Fev...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 24. Série Histórica de Inundações (Gráfico 29)
-- Terceiro pilar temporal (junto com Seca e Enxurrada).
-- Pico em 2009 (717 ocorrências), diferente de Enxurrada (2010/11) e Seca (2012).
CREATE TABLE IF NOT EXISTS flood_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 25. Distribuição de Alagamentos por Região (Gráfico 35)
-- "Alagamento" = Problema de Drenagem Urbana. Sudeste domina (43%). Centro-Oeste quase imune (2%).
CREATE TABLE IF NOT EXISTS urban_flood_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 43.00
    created_at TIMESTAMP DEFAULT NOW()
);

-- 26. Sazonalidade de Alagamentos por Região (Gráfico 36)
-- Mostra quando a drenagem urbana falha. Pico em Jan (SE), mas números absolutos baixos (subnotificação?).
CREATE TABLE IF NOT EXISTS urban_flood_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name CHAR(3) NOT NULL, -- Jan, Fev...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 27. Série Histórica de Alagamentos (Gráfico 42)
-- Mostra a explosão da urbanização desordenada.
-- Média 1991-2001: ~4.5 eventos/ano. Média 2002-2012: ~42 eventos/ano. (Crescimento de 830%).
CREATE TABLE IF NOT EXISTS urban_flood_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 28. Distribuição de Vendavais por Região (Gráfico 43)
-- "Vendaval" = Desastre de Vento. O Sul domina brutalmente (77.4%). O resto do país é irrelevante estatisticamente.
CREATE TABLE IF NOT EXISTS gale_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 77.40
    created_at TIMESTAMP DEFAULT NOW()
);

-- 29. Ocorrências de Vendaval por Estado (Tabela 2)
-- Granularidade Estadual (UF). Confirma o "Trio do Vento": RS, PR, SC.
CREATE TABLE IF NOT EXISTS state_gale_stats (
    id BIGSERIAL PRIMARY KEY,
    state_code CHAR(2) NOT NULL, -- UF
    region_name VARCHAR(50) NOT NULL,
    municipalities_affected INT DEFAULT 0,
    occurrences INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 30. Sazonalidade de Vendavais por Região (Gráfico 44)
-- O "Grande Pico" de Out/Nov no Sul (380+ eventos). Alerta máximo de destelhamento.
CREATE TABLE IF NOT EXISTS gale_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name CHAR(3) NOT NULL, -- Jan, Fev...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 31. Série Histórica de Vendavais (Gráfico 45)
-- Pico em 2009 (364 eventos), coincidindo com o ano das Inundações.
CREATE TABLE IF NOT EXISTS gale_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 32. Eventos Letais de Vendaval (Tabela 3)
-- Lista granular de eventos que causaram óbitos (1991-2012).
CREATE TABLE IF NOT EXISTS gale_mortality_events (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL,
    region_name VARCHAR(50) NOT NULL,
    state_code CHAR(2) NOT NULL,
    deaths INT DEFAULT 0,
    injured INT DEFAULT 0,
    displaced INT DEFAULT 0, -- Desalojados
    affected INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 33. Distribuição de Granizo por Região (Gráfico 51)
-- O desastre mais regionalizado do país. Sul domina com 88.3%. Norte/Nordeste estatisticamente zero.
CREATE TABLE IF NOT EXISTS hail_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 88.30
    created_at TIMESTAMP DEFAULT NOW()
);

-- 34. Ocorrências de Granizo por Estado (Tabela 4)
-- Granularidade Estadual. Confirma SC como a capital nacional do granizo (536 eventos).
CREATE TABLE IF NOT EXISTS state_hail_stats (
    id BIGSERIAL PRIMARY KEY,
    state_code CHAR(2) NOT NULL, -- UF
    region_name VARCHAR(50) NOT NULL,
    municipalities_affected INT DEFAULT 0,
    occurrences INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 35. Sazonalidade de Granizo por Região (Gráfico 52)
-- O pico de Set/Out no Sul (300+ eventos). APENAS Sul e Sudeste possuem dados relevantes.
CREATE TABLE IF NOT EXISTS hail_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name CHAR(3) NOT NULL, -- Jan, Fev...
    south INT DEFAULT 0,
    southeast INT DEFAULT 0,
    -- Norte, Nordeste e Centro-Oeste são estatisticamente zero.
    created_at TIMESTAMP DEFAULT NOW()
);

-- 36. Série Histórica de Granizo (Gráfico 53)
-- Pico em 1998 (El Niño forte - 158 eventos). Correlação direta com oscilações climáticas.
CREATE TABLE IF NOT EXISTS hail_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    notes VARCHAR(255), -- Ex: "El Niño Forte"
    created_at TIMESTAMP DEFAULT NOW()
);

-- 37. Eventos Letais de Granizo (Tabela 5)
-- Lista granular de eventos que causaram óbitos (1991-2012). O Paraná 1997 foi o mais letal.
CREATE TABLE IF NOT EXISTS hail_mortality_events (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL,
    region_name VARCHAR(50) NOT NULL,
    state_code CHAR(2) NOT NULL,
    deaths INT DEFAULT 0,
    injured INT DEFAULT 0,
    displaced INT DEFAULT 0, -- Desalojados
    affected INT DEFAULT 0,
    notes VARCHAR(255), -- Ex: "Evento mais letal registrado"
    created_at TIMESTAMP DEFAULT NOW()
);

-- 38. Distribuição de Movimentos de Massa por Região (Gráfico 59)
-- O desastre mais concentrado do Brasil. Sudeste domina com 79.8%. Topografia + Urbanização = Morte.
CREATE TABLE IF NOT EXISTS mass_movement_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 79.80
    created_at TIMESTAMP DEFAULT NOW()
);

-- 39. Ocorrências de Movimento de Massa por Estado (Tabela 6)
-- O "Triângulo da Morte": MG(208), SP(165), RJ(153) - Onde a Serra do Mar encontra a urbanização.
CREATE TABLE IF NOT EXISTS state_mass_movement_stats (
    id BIGSERIAL PRIMARY KEY,
    state_code CHAR(2) NOT NULL, -- UF
    region_name VARCHAR(50) NOT NULL,
    municipalities_affected INT DEFAULT 0,
    occurrences INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 40. Sazonalidade de Movimentos de Massa por Região (Tabela 7)
-- Janeiro no Sudeste = 215 eventos. O verão chuvoso satura as encostas.
-- Alerta Vermelho: Dez, Jan, Fev no Sudeste = Risco EXTREMO.
CREATE TABLE IF NOT EXISTS mass_movement_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name CHAR(3) NOT NULL, -- Jan, Fev...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 41. Série Histórica de Movimentos de Massa (Gráfico 65)
-- Crescimento de 3000% de 1991 para 2011. O pico de 2011 é a Tragédia Serrana (RJ).
CREATE TABLE IF NOT EXISTS mass_movement_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    notes VARCHAR(255), -- Ex: "Tragédia Serrana RJ"
    created_at TIMESTAMP DEFAULT NOW()
);

-- 42. Distribuição de Erosão por Região (Gráfico 66)
-- Único desastre onde o Norte lidera (30.9%). Erosão Fluvial (terras caídas) afetando ribeirinhos.
CREATE TABLE IF NOT EXISTS erosion_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 30.90
    focus_area VARCHAR(100), -- Ex: "Margens fluviais/Ribeirinhos"
    created_at TIMESTAMP DEFAULT NOW()
);

-- 43. Ocorrências de Erosão por Estado (Tabela 8)
-- Norte lidera: PA(54), AM(50). RJ = 0 (curiosamente, apesar de liderar deslizamentos).
CREATE TABLE IF NOT EXISTS state_erosion_stats (
    id BIGSERIAL PRIMARY KEY,
    state_code VARCHAR(5) NOT NULL, -- UF ou GO_DF
    region_name VARCHAR(50) NOT NULL,
    occurrences INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 44. Sazonalidade de Erosão por Região (Tabela 9)
-- Sazonalidade difusa: Norte pica em Abril (cheia), NE em Agosto (inverno), Sul em Outubro.
CREATE TABLE IF NOT EXISTS erosion_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name CHAR(3) NOT NULL, -- Jan, Fev...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 45. Distribuição de Incêndios Florestais por Região (Gráfico 74)
-- Norte lidera (40.21% - Amazônia) seguido de Nordeste (32.60% - Bahia/Cerrado).
CREATE TABLE IF NOT EXISTS forest_fire_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 40.21
    notes VARCHAR(100), -- Ex: "Maior incidência (Amazônia)"
    created_at TIMESTAMP DEFAULT NOW()
);

-- 46. Ocorrências de Incêndio Florestal por Estado (Tabela 10)
-- Bahia lidera o país (53). Tocantins lidera o Norte (25). Mato Grosso forte por pressão agrícola.
CREATE TABLE IF NOT EXISTS state_forest_fire_stats (
    id BIGSERIAL PRIMARY KEY,
    state_code CHAR(2) NOT NULL, -- UF
    region_name VARCHAR(50) NOT NULL,
    occurrences INT DEFAULT 0,
    notes VARCHAR(100), -- Ex: "Líder Nacional"
    created_at TIMESTAMP DEFAULT NOW()
);

-- 47. Sazonalidade de Incêndio Florestal por Região (Tabela 11)
-- Dois picos distintos: Setembro no Norte (35), Outubro no Nordeste (52).
CREATE TABLE IF NOT EXISTS forest_fire_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name VARCHAR(10) NOT NULL, -- Janeiro, Fevereiro...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 48. Série Histórica de Incêndio Florestal (Gráfico 81)
-- Pico em 1998 (29 eventos - El Niño) e 2010 (20 eventos - seca severa).
CREATE TABLE IF NOT EXISTS forest_fire_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    notes VARCHAR(255), -- Ex: "El Niño Forte"
    created_at TIMESTAMP DEFAULT NOW()
);

-- 49. Distribuição de Tornados por Região (Gráfico 82)
-- Fenômeno exclusivo do Sul (98%). O restante do Brasil pode ignorar tornados.
CREATE TABLE IF NOT EXISTS tornado_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 98.00
    created_at TIMESTAMP DEFAULT NOW()
);

-- 50. Sazonalidade de Tornados por Região (Gráfico 83)
-- Sul domina com pico em Outubro (9 eventos). Primavera é a estação de risco.
CREATE TABLE IF NOT EXISTS tornado_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name VARCHAR(10) NOT NULL, -- Janeiro, Fevereiro...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 51. Série Histórica de Tornados (Gráfico 86)
-- Picos em 2003 e 2009 (7 eventos cada). Menos correlação direta com El Niño de 98.
CREATE TABLE IF NOT EXISTS tornado_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    notes VARCHAR(255), -- Ex: "Pico de 2003"
    created_at TIMESTAMP DEFAULT NOW()
);

-- 52. Distribuição de Geada por Região (Gráfico 87)
-- Sul domina (86.7%), seguido por Sudeste (13.3%). Zero nas regiões tropicais.
CREATE TABLE IF NOT EXISTS frost_distribution_stats (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    region_acronym CHAR(2) NOT NULL,
    percentage NUMERIC(5, 2), -- Ex: 86.70
    created_at TIMESTAMP DEFAULT NOW()
);

-- 53. Ocorrências de Geada por Estado (Tabela 12)
-- Santa Catarina lidera (23 eventos). SP (6) representa o Sudeste. MG/RJ/ES = 0 nesta amostra.
CREATE TABLE IF NOT EXISTS state_frost_stats (
    id BIGSERIAL PRIMARY KEY,
    state_code CHAR(2) NOT NULL, -- UF
    region_name VARCHAR(50) NOT NULL,
    occurrences INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 54. Sazonalidade de Geada por Região (Gráfico 88)
-- Pico surpreendente em Setembro (20 eventos) no Sul. Geada tardia é a mais destrutiva.
CREATE TABLE IF NOT EXISTS frost_monthly_stats (
    id BIGSERIAL PRIMARY KEY,
    month_name VARCHAR(10) NOT NULL, -- Janeiro, Fevereiro...
    north INT DEFAULT 0,
    northeast INT DEFAULT 0,
    center_west INT DEFAULT 0,
    southeast INT DEFAULT 0,
    south INT DEFAULT 0,
    total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 55. Série Histórica de Geada (Gráfico 89)
-- Picos recentes: 2006 (12) e 2012 (16). Quase nulo nos anos 90 (provável subnotificação ou ciclo quente).
CREATE TABLE IF NOT EXISTS frost_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    occurrences INT NOT NULL,
    notes VARCHAR(255), -- Ex: "Pico de 2012"
    created_at TIMESTAMP DEFAULT NOW()
);

-- 56. Principais Eventos de Geada (Tabela 13)
-- Lista os eventos com maior número de afetados. SC (2000) e SP (2009) lideram.
CREATE TABLE IF NOT EXISTS frost_major_events (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL,
    region_name VARCHAR(50) NOT NULL,
    state_code CHAR(2) NOT NULL,
    deaths INT DEFAULT 0,
    sick INT DEFAULT 0,
    displaced INT DEFAULT 0,
    affected INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 57. Resumo Nacional de Desastres por Estado (Tabela 14)
-- O Ranking Definitivo: RS (5.789), MG (5.086), SC (5.001) lideram em ocorrências absolutas.
CREATE TABLE IF NOT EXISTS national_disaster_summary (
    id BIGSERIAL PRIMARY KEY,
    state_code CHAR(2) NOT NULL UNIQUE,
    region_name VARCHAR(50) NOT NULL,
    total_occurrences INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 58. Totais de Registros por Tipo de Desastre (Gráfico 92)
-- Estiagem e Seca (20.009) dominam absolutamente o cenário brasileiro.
CREATE TABLE IF NOT EXISTS national_disaster_types_stats (
    id BIGSERIAL PRIMARY KEY,
    disaster_type VARCHAR(50) NOT NULL UNIQUE,
    total_records INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 59. Resumo Regional de Desastres e Danos Humanos (Tabela 16)
-- Nordeste lidera em Ocorrências (15k) e Afetados (56M), impulsionado pela Seca.
CREATE TABLE IF NOT EXISTS regional_disaster_summary (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL UNIQUE,
    total_records INT NOT NULL,
    total_human_damages BIGINT NOT NULL, -- Pode passar de 4 bilhões (int4), usar BIGINT
    created_at TIMESTAMP DEFAULT NOW()
);

-- 60. Municípios Mais Atingidos (Gráfico 93 - Detalhado)
-- Agora com colunas específicas para cada desastre (SECEST, MOVMAS, etc).
CREATE TABLE IF NOT EXISTS top_affected_municipalities_stats (
    id BIGSERIAL PRIMARY KEY,
    municipality VARCHAR(100) NOT NULL,
    state_code CHAR(2) NOT NULL,
    drought_dry INT DEFAULT 0,    -- SECEST
    mass_movement INT DEFAULT 0,  -- MOVMAS
    erosion INT DEFAULT 0,        -- EROS
    flood INT DEFAULT 0,          -- ALAG (Alagamento)
    flash_flood INT DEFAULT 0,    -- ENX (Enxurrada)
    inundation INT DEFAULT 0,     -- INUN (Inundação Gradual)
    hail INT DEFAULT 0,           -- GRAN
    wind INT DEFAULT 0,           -- VENDA (Vendaval)
    fire INT DEFAULT 0,           -- INCEN
    tornado INT DEFAULT 0,        -- TOR
    frost INT DEFAULT 0,          -- GEA
    total_occurrences INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 61. Comparação Década a Década (Gráfico 99)
-- Explosão de eventos: 70.5% ocorreram na segunda década (2002-2012). Mudança Climática ou Melhor Notificação?
CREATE TABLE IF NOT EXISTS decadal_comparison_stats (
    id BIGSERIAL PRIMARY KEY,
    period_label VARCHAR(50) NOT NULL, -- '1991-2001', '2002-2012'
    percentage NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 62. Evolução Histórica Nacional (Gráfico 100)
-- A Prova Final: De 773 (1991) para 3.803 (2012). Um aumento de ~400% em 20 anos.
CREATE TABLE IF NOT EXISTS national_disaster_history_stats (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    total_events INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 63. Tabela de Cruzamento ATLAS x NASA (The Match Engine)
-- Armazena descobertas feitas cruzando dados históricos do Atlas com satélites da NASA.
CREATE TABLE IF NOT EXISTS atlas_nasa_matches (
    id BIGSERIAL PRIMARY KEY,
    atlas_source_table VARCHAR(100), -- De onde veio a pista (ex: 'frost_major_events')
    atlas_event_description VARCHAR(255), -- Ex: 'Geada SC 2000'
    suspected_date DATE, -- Data descoberta pela NASA (ex: 2000-07-17)
    nasa_parameter VARCHAR(50), -- Ex: 'T2M_MIN' (Temperatura Mínima)
    nasa_value NUMERIC(10, 2), -- Ex: -4.5
    confidence_level VARCHAR(20), -- 'High', 'Medium', 'Low'
    created_at TIMESTAMP DEFAULT NOW()
);

-- 64. Tabela de Dados Climáticos Locais (Projeto Xavier)
-- "Ground Truth" para calibração. Armazena séries temporais extraídas dos arquivos NetCDF.
CREATE TABLE IF NOT EXISTS xavier_climate_data (
    id BIGSERIAL PRIMARY KEY,
    location_label VARCHAR(50) NOT NULL, -- Ex: 'RJ_MOUNTAIN_REGION'
    measure_date DATE NOT NULL,
    precipitation NUMERIC(10, 2), -- pr (mm)
    t_min NUMERIC(10, 2), -- Tmin (°C)
    t_max NUMERIC(10, 2), -- Tmax (°C)
    wind_speed NUMERIC(10, 2), -- u2 (m/s)
    humidity NUMERIC(10, 2), -- RH (%)
    radiation NUMERIC(10, 2), -- Rs (MJ/m2)
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (location_label, measure_date) -- Garante que podemos dar UPSERT (atualizar colunas separadamente)
);

-- Comentário:
-- Rode este script no PgAdmin para preparar o banco para a ingestão dos dados do Atlas.

