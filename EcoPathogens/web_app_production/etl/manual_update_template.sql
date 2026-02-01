-- Use este arquivo para adicionar rapidamente os números das Tabelas que o PDF não permitiu extrair.
-- Basta substituir OS ZEROS (0) pelos valores do livro.

-- ==============================================================================
-- 1. ESTIAGEM E SECA (Mapa 2 / Tabela na pág 40-41)
-- ==============================================================================
-- Inserir Total por Região/Estado (Ano de referência 2012 para agregação)
INSERT INTO disaster_seasonality (event_type, month_name, north, northeast, center_west, southeast, south, brasil_total) VALUES
('Estiagem e Seca', 'Janeiro',   0, 0, 0, 0, 0, 0), -- Substitua os 0
('Estiagem e Seca', 'Fevereiro', 0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Março',     0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Abril',     0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Maio',      0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Junho',     0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Julho',     0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Agosto',    0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Setembro',  0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Outubro',   0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Novembro',  0, 0, 0, 0, 0, 0),
('Estiagem e Seca', 'Dezembro',  0, 0, 0, 0, 0, 0);

-- ==============================================================================
-- 2. INUNDAÇÃO (Mapa 4 / Tabela 1 - pág 53)
-- ==============================================================================
-- Exemplo: INSERT INTO disaster_events (event_type, state_code, year, event_date, source_document) ...
-- Como são dados agregados de 1991-2012, insira o total de ocorrências:

INSERT INTO disaster_events (event_type, state_code, year, event_date, source_document) VALUES
('Inundação', 'AC', 2012, '2012-12-31', 'Atlas Manual - AC Total'), -- Substitua se tiver o numero exato na descrição
('Inundação', 'AL', 2012, '2012-12-31', 'Atlas Manual - AL Total'),
('Inundação', 'AM', 2012, '2012-12-31', 'Atlas Manual - AM Total'),
('Inundação', 'AP', 2012, '2012-12-31', 'Atlas Manual - AP Total'),
('Inundação', 'BA', 2012, '2012-12-31', 'Atlas Manual - BA Total'),
('Inundação', 'CE', 2012, '2012-12-31', 'Atlas Manual - CE Total'),
('Inundação', 'ES', 2012, '2012-12-31', 'Atlas Manual - ES Total'),
('Inundação', 'GO', 2012, '2012-12-31', 'Atlas Manual - GO Total'),
('Inundação', 'MA', 2012, '2012-12-31', 'Atlas Manual - MA Total'),
('Inundação', 'MG', 2012, '2012-12-31', 'Atlas Manual - MG Total'),
('Inundação', 'MS', 2012, '2012-12-31', 'Atlas Manual - MS Total'),
('Inundação', 'MT', 2012, '2012-12-31', 'Atlas Manual - MT Total'),
('Inundação', 'PA', 2012, '2012-12-31', 'Atlas Manual - PA Total'),
('Inundação', 'PB', 2012, '2012-12-31', 'Atlas Manual - PB Total'),
('Inundação', 'PE', 2012, '2012-12-31', 'Atlas Manual - PE Total'),
('Inundação', 'PI', 2012, '2012-12-31', 'Atlas Manual - PI Total'),
('Inundação', 'PR', 2012, '2012-12-31', 'Atlas Manual - PR Total'),
('Inundação', 'RJ', 2012, '2012-12-31', 'Atlas Manual - RJ Total'),
('Inundação', 'RN', 2012, '2012-12-31', 'Atlas Manual - RN Total'),
('Inundação', 'RO', 2012, '2012-12-31', 'Atlas Manual - RO Total'),
('Inundação', 'RR', 2012, '2012-12-31', 'Atlas Manual - RR Total'),
('Inundação', 'RS', 2012, '2012-12-31', 'Atlas Manual - RS Total'),
('Inundação', 'SC', 2012, '2012-12-31', 'Atlas Manual - SC Total'),
('Inundação', 'SE', 2012, '2012-12-31', 'Atlas Manual - SE Total'),
('Inundação', 'SP', 2012, '2012-12-31', 'Atlas Manual - SP Total'),
('Inundação', 'TO', 2012, '2012-12-31', 'Atlas Manual - TO Total');

-- ==============================================================================
-- 3. ENXURRADA (Mapa 3 / Tabela na pág 46)
-- ==============================================================================
INSERT INTO disaster_seasonality (event_type, month_name, brasil_total) VALUES
('Enxurrada', 'Janeiro', 0),
('Enxurrada', 'Fevereiro', 0),
('Enxurrada', 'Março', 0),
('Enxurrada', 'Abril', 0),
('Enxurrada', 'Maio', 0),
('Enxurrada', 'Junho', 0),
('Enxurrada', 'Julho', 0),
('Enxurrada', 'Agosto', 0),
('Enxurrada', 'Setembro', 0),
('Enxurrada', 'Outubro', 0),
('Enxurrada', 'Novembro', 0),
('Enxurrada', 'Dezembro', 0);

-- ==============================================================================
-- 4. EROSÃO (Mapa 9 / Tabela 8 - pág 91)
-- ==============================================================================
-- Preencha os totais observados na tabela
-- INSERT INTO disaster_events ...

-- DICA:
-- Após editar este arquivo e salvar, você pode rodá-lo no PgAdmin ou pedir para eu executar:
-- "Execute o arquivo manual_update.sql"

