-- ============================================
-- VERSIÓN SIMPLE - Muestra solo lo esencial
-- Ejecuta esto en Supabase SQL Editor
-- ============================================

-- TABLAS Y SUS COLUMNAS
SELECT 
    t.table_name as "Tabla",
    c.column_name as "Columna",
    c.data_type as "Tipo",
    CASE WHEN c.is_nullable = 'NO' THEN 'NOT NULL' ELSE 'NULL' END as "Nullable",
    c.column_default as "Default"
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;

-- FOREIGN KEYS (CONEXIONES)
SELECT
    tc.table_name as "Tabla Origen",
    kcu.column_name as "Columna Origen",
    ccu.table_name as "Tabla Destino",
    ccu.column_name as "Columna Destino"
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

