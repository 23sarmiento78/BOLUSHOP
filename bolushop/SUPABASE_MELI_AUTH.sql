-- Tabla para almacenar tokens OAuth de Mercado Libre (una sola fila, id = 1)
CREATE TABLE IF NOT EXISTS meli_auth (
  id INTEGER PRIMARY KEY DEFAULT 1,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  user_id BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT meli_auth_single_row CHECK (id = 1)
);

ALTER TABLE meli_auth ENABLE ROW LEVEL SECURITY;
