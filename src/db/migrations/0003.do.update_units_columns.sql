ALTER TABLE units
  ADD COLUMN code varchar(50),
  ADD COLUMN is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN deleted_at timestamptz;