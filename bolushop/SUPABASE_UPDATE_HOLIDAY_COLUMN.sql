-- Migration: Agregar columna holiday a collections
-- Fecha: 2026-02-05
-- Descripción: Agrega soporte para vincular colecciones con feriados específicos

-- Agregar columna holiday a la tabla collections
ALTER TABLE public.collections 
ADD COLUMN IF NOT EXISTS holiday text DEFAULT 'none';

-- Comentario explicativo
COMMENT ON COLUMN public.collections.holiday IS 'ID del feriado asociado a esta colección (valentines, carnival, easter, etc.) o "none" para colecciones permanentes';

-- Índice para mejorar queries por holiday
CREATE INDEX IF NOT EXISTS idx_collections_holiday ON public.collections(holiday);

-- Verificar la estructura actualizada
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'collections' AND table_schema = 'public';
