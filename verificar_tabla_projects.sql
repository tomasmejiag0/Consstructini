-- ============================================
-- VERIFICAR ESTRUCTURA DE LA TABLA PROJECTS
-- Ejecuta esto en Supabase SQL Editor
-- ============================================

-- 1. Ver todas las columnas de la tabla projects
SELECT 
    column_name as "Columna",
    data_type as "Tipo",
    character_maximum_length as "Longitud",
    is_nullable as "Puede ser NULL",
    column_default as "Valor por defecto"
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'projects'
ORDER BY ordinal_position;

-- 2. Ver todas las foreign keys de projects
SELECT
    kcu.column_name as "Columna",
    ccu.table_name as "Tabla Referenciada",
    ccu.column_name as "Columna Referenciada",
    tc.constraint_name as "Nombre Constraint"
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name = 'projects';

-- 3. Ver restricciones CHECK de projects
SELECT
    tc.constraint_name,
    cc.check_clause
FROM information_schema.check_constraints cc
JOIN information_schema.table_constraints tc
    ON cc.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
    AND tc.table_name = 'projects';

-- 4. Ver los últimos 5 proyectos creados (para verificar que se están guardando)
SELECT 
    id,
    name,
    location_name,
    manager_id,
    status,
    created_at
FROM projects
ORDER BY created_at DESC
LIMIT 5;

