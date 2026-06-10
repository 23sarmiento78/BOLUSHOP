-- Tabla para almacenar tokens OAuth de Mercado Libre (una sola fila, id = 1)
CREATE TABLE IF NOT EXISTS meli_auth (
  id INTEGER PRIMARY KEY DEFAULT 1,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT meli_auth_single_row CHECK (id = 1)
);

-- Si tenías user_id y no la necesitás, eliminarla:
ALTER TABLE meli_auth DROP COLUMN IF EXISTS user_id;

-- Refrescar caché de PostgREST (obligatorio tras cambios de esquema)
NOTIFY pgrst, 'reload schema';

ALTER TABLE meli_auth ENABLE ROW LEVEL SECURITY;
