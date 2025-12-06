-- Seed common Indonesian defaults: roles, sample company, outlet, categories, and units
BEGIN;

-- Ensure baseline roles used across the system
INSERT INTO roles (name, description)
VALUES
  ('OWNER', 'Pemilik usaha dengan akses penuh'),
  ('KASIR', 'Kasir untuk transaksi penjualan'),
  ('STAFF', 'Staf umum tanpa akses sensitif'),
  ('ADMIN_GUDANG', 'Admin gudang untuk kelola stok'),
--   ('PURCHASING', 'Staf pembelian'),
--   ('FINANCE', 'Keuangan untuk rekonsiliasi pembayaran'),
  ('MANAGER', 'Pengawasan operasional')
ON CONFLICT (name) DO NOTHING;

-- Create a sample company to host seeded master data
INSERT INTO companies (id, name, code, address)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Perusahaan Contoh',
  'DEFAULT',
  'Alamat contoh, Jakarta, Indonesia'
)
ON CONFLICT (code) DO NOTHING;

DO $$
DECLARE
  v_company_id uuid;
BEGIN
  SELECT id INTO v_company_id FROM companies WHERE code = 'DEFAULT' LIMIT 1;

  IF v_company_id IS NOT NULL THEN
    -- Create a primary outlet for the sample company
    INSERT INTO outlets (id, company_id, name, code, address, phone)
    VALUES (
      '00000000-0000-0000-0000-000000000010',
      v_company_id,
      'Outlet Pusat',
      'PUSAT',
      'Outlet utama, Jakarta',
      '0800-1234-0000'
    )
    ON CONFLICT (company_id, code) WHERE code IS NOT NULL DO NOTHING;

    -- -- Seed common Indonesian product categories
    -- INSERT INTO categories (company_id, name, code)
    -- SELECT v_company_id, c.name, c.code
    -- FROM (
    --   VALUES
    --     ('Sembako', 'SEM'),
    --     ('Minuman', 'MIN'),
    --     ('Makanan Ringan', 'SNK'),
    --     ('Perawatan Pribadi', 'PRP'),
    --     ('Kebersihan Rumah', 'KBR'),
    --     ('Elektronik', 'ELK'),
    --     ('ATK & Kantor', 'ATK'),
    --     ('Pakaian & Aksesoris', 'PKN'),
    --     ('Ibu & Bayi', 'IBB'),
    --     ('Makanan Beku', 'BKU')
    -- ) AS c(name, code)
    -- WHERE NOT EXISTS (
    --   SELECT 1 FROM categories existing
    --   WHERE existing.company_id = v_company_id
    --     AND (existing.name = c.name OR (existing.code IS NOT NULL AND existing.code = c.code))
    -- );

    -- Seed common measurement units
    INSERT INTO units (company_id, name, short_name)
    SELECT v_company_id, u.name, u.short_name
    FROM (
      VALUES
        ('Pieces', 'pcs'),
        ('Pack', 'pack'),
        ('Box', 'box'),
        ('Lusin', 'lsn'),
        ('Kilogram', 'kg'),
        ('Gram', 'g'),
        ('Liter', 'l'),
        ('Mililiter', 'ml'),
        ('Meter', 'm'),
        ('Centimeter', 'cm')
    ) AS u(name, short_name)
    WHERE NOT EXISTS (
      SELECT 1 FROM units existing
      WHERE existing.company_id = v_company_id
        AND (existing.name = u.name OR (existing.short_name IS NOT NULL AND existing.short_name = u.short_name))
    );
  END IF;
END $$;

COMMIT;