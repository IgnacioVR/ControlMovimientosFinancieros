-- ===========================================
--  EXTENSIONES NECESARIAS
-- ===========================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_cron;  -- importante en Supabase

-- ===========================================
--  TABLA DE MOVIMIENTOS
-- ===========================================
CREATE TABLE IF NOT EXISTS movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha DATE NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('DEBITO', 'CREDITO')),
    monto NUMERIC NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
--  FUNCIÓN: VALIDAR MONTOS
-- ===========================================
CREATE OR REPLACE FUNCTION validate_amount() 
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.tipo = 'DEBITO' AND NEW.monto >= 0) THEN
        RAISE EXCEPTION 'Monto para DEBITO debe ser negativo';
    
    ELSIF (NEW.tipo = 'CREDITO' AND NEW.monto <= 0) THEN
        RAISE EXCEPTION 'Monto para CREDITO debe ser positivo';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
--  TRIGGER DE VALIDACIÓN
-- ===========================================
CREATE OR REPLACE TRIGGER trg_validate_amount
BEFORE INSERT OR UPDATE ON movements 
FOR EACH ROW 
EXECUTE FUNCTION validate_amount();

-- ===========================================
--  FUNCIÓN: REPORTE MENSUAL
-- ===========================================
CREATE OR REPLACE FUNCTION sp_generate_monthly_report(p_year NUMERIC, p_month NUMERIC)
RETURNS TABLE (
    total_creditos NUMERIC,
    total_debitos NUMERIC,
    balance NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(monto) FILTER (WHERE tipo = 'CREDITO'), 0),
        COALESCE(SUM(monto) FILTER (WHERE tipo = 'DEBITO'), 0),
        COALESCE(SUM(monto), 0)
    FROM movements
    WHERE EXTRACT(YEAR FROM fecha) = p_year 
      AND EXTRACT(MONTH FROM fecha) = p_month;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
--  FUNCIÓN: BORRAR MOVIMIENTOS > 2 SEMANAS
-- ===========================================
CREATE OR REPLACE FUNCTION sp_delete_old_movements()
RETURNS void AS $$
BEGIN
    DELETE FROM movements
    WHERE fecha < CURRENT_DATE - INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql;

-- ===========================================
--  APLICAR SEARCH PATH (RECOMENDADO EN SUPABASE)
-- ===========================================
SET search_path TO public, cron;

-- ===========================================
--  SCHEDULE DIARIO (pg_cron)
--  Ejecuta la función todos los días a medianoche
-- ===========================================
SELECT cron.schedule(
    'borrar_movimientos_antiguos',   -- nombre del job
    '0 0 * * *',                     -- todos los días a las 00:00
    $$SELECT sp_delete_old_movements();$$
);
