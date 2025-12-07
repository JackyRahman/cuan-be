-- Remove seeded Indonesian defaults
BEGIN;

-- Clean up seeded outlet and categories/units for the sample company
DO $$
DECLARE
  v_company_id uuid;
BEGIN
  SELECT id INTO v_company_id FROM companies WHERE code = 'CUAN' LIMIT 1;

  IF v_company_id IS NOT NULL THEN
    DELETE FROM categories WHERE company_id = v_company_id;
    DELETE FROM units WHERE company_id = v_company_id;
    DELETE FROM outlets WHERE company_id = v_company_id AND code = 'PUSAT';
    DELETE FROM companies WHERE id = v_company_id;
  END IF;
END $$;

-- Remove seeded roles
DELETE FROM roles
WHERE name IN ('OWNER', 'KASIR', 'STAFF', 'ADMIN_GUDANG', 'PURCHASING', 'FINANCE', 'MANAGER');

COMMIT;