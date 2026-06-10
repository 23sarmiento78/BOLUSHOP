-- Tabla para almacenar tokens OAuth de Mercado Libre
-- Nota: si creás la tabla desde el UI de Supabase, "id" será identity (auto).
-- El callback NO inserta id manualmente; actualiza la fila existente o inserta una nueva.

CREATE TABLE IF NOT EXISTS meli_auth (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meli_auth DROP COLUMN IF EXISTS user_id;

NOTIFY pgrst, 'reload schema';

ALTER TABLE meli_auth ENABLE ROW LEVEL SECURITY;
