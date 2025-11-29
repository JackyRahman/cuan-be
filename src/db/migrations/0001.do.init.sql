-- Down migration not implemented for initial schema
BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(200) NOT NULL,
    code varchar(50) UNIQUE,
    tax_id varchar(50),
    address text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid,
    updated_by uuid
);

CREATE TABLE outlets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    name varchar(200) NOT NULL,
    code varchar(50),
    address text,
    phone varchar(50),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid,
    updated_by uuid
);

CREATE UNIQUE INDEX outlets_company_code_ux
    ON outlets(company_id, code)
    WHERE code IS NOT NULL;

CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX roles_name_ux ON roles(name);

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    full_name varchar(200) NOT NULL,
    username varchar(100) NOT NULL,
    email varchar(200),
    password_hash varchar(255) NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid,
    updated_by uuid
);

CREATE UNIQUE INDEX users_company_username_ux
    ON users(company_id, username);

CREATE TABLE user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id),
    role_id uuid NOT NULL REFERENCES roles(id),
    outlet_id uuid REFERENCES outlets(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX user_roles_unique
    ON user_roles(user_id, role_id, outlet_id);

CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    parent_id uuid REFERENCES categories(id),
    name varchar(200) NOT NULL,
    code varchar(50),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE UNIQUE INDEX categories_company_code_ux
    ON categories(company_id, code)
    WHERE code IS NOT NULL;

CREATE TABLE brands (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    name varchar(200) NOT NULL,
    code varchar(50),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE UNIQUE INDEX brands_company_code_ux
    ON brands(company_id, code)
    WHERE code IS NOT NULL;

CREATE TABLE units (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    name varchar(100) NOT NULL,
    short_name varchar(20),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    category_id uuid REFERENCES categories(id),
    brand_id uuid REFERENCES brands(id),
    name varchar(200) NOT NULL,
    code varchar(50),
    description text,
    is_service boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE UNIQUE INDEX products_company_code_ux
    ON products(company_id, code)
    WHERE code IS NOT NULL;

CREATE TABLE product_variants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES products(id),
    name varchar(200),
    sku varchar(100),
    unit_id uuid REFERENCES units(id),
    cost_price numeric(18,2) NOT NULL DEFAULT 0,
    sell_price numeric(18,2) NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE UNIQUE INDEX product_variants_sku_ux
    ON product_variants(sku)
    WHERE sku IS NOT NULL;

CREATE TABLE product_barcodes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id uuid NOT NULL REFERENCES product_variants(id),
    barcode varchar(100) NOT NULL,
    is_primary boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX product_barcodes_barcode_ux
    ON product_barcodes(barcode);

CREATE TABLE warehouses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id uuid NOT NULL REFERENCES outlets(id),
    name varchar(200) NOT NULL,
    code varchar(50),
    type varchar(50) NOT NULL DEFAULT 'WAREHOUSE',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE UNIQUE INDEX warehouses_outlet_code_ux
    ON warehouses(outlet_id, code)
    WHERE code IS NOT NULL;

CREATE TABLE inventory_balances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id uuid NOT NULL REFERENCES warehouses(id),
    variant_id uuid NOT NULL REFERENCES product_variants(id),
    qty numeric(18,3) NOT NULL DEFAULT 0,
    min_qty numeric(18,3) NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX inventory_balances_wh_variant_ux
    ON inventory_balances(warehouse_id, variant_id);

CREATE TABLE stock_movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    source_warehouse_id uuid REFERENCES warehouses(id),
    target_warehouse_id uuid REFERENCES warehouses(id),
    ref_type varchar(50) NOT NULL,
    ref_id uuid,
    movement_date timestamptz NOT NULL DEFAULT now(),
    note text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE stock_movement_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_movement_id uuid NOT NULL REFERENCES stock_movements(id) ON DELETE CASCADE,
    variant_id uuid NOT NULL REFERENCES product_variants(id),
    qty numeric(18,3) NOT NULL,
    unit_cost numeric(18,2),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE stock_opnames (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id uuid NOT NULL REFERENCES warehouses(id),
    opname_date date NOT NULL,
    status varchar(30) NOT NULL DEFAULT 'DRAFT',
    note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE stock_opname_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_opname_id uuid NOT NULL REFERENCES stock_opnames(id) ON DELETE CASCADE,
    variant_id uuid NOT NULL REFERENCES product_variants(id),
    system_qty numeric(18,3) NOT NULL,
    counted_qty numeric(18,3) NOT NULL,
    difference_qty numeric(18,3) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE suppliers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    name varchar(200) NOT NULL,
    code varchar(50),
    phone varchar(50),
    address text,
    email varchar(200),
    default_payment_term_days int,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE UNIQUE INDEX suppliers_company_code_ux
    ON suppliers(company_id, code)
    WHERE code IS NOT NULL;

CREATE TABLE purchase_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    supplier_id uuid NOT NULL REFERENCES suppliers(id),
    outlet_id uuid NOT NULL REFERENCES outlets(id),
    order_number varchar(50) NOT NULL,
    order_date date NOT NULL,
    status varchar(30) NOT NULL DEFAULT 'DRAFT',
    note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX purchase_orders_company_number_ux
    ON purchase_orders(company_id, order_number);

CREATE TABLE purchase_order_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    variant_id uuid NOT NULL REFERENCES product_variants(id),
    qty numeric(18,3) NOT NULL,
    unit_cost numeric(18,2) NOT NULL,
    discount_amount numeric(18,2) NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE purchase_invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    supplier_id uuid NOT NULL REFERENCES suppliers(id),
    outlet_id uuid NOT NULL REFERENCES outlets(id),
    invoice_number varchar(50) NOT NULL,
    invoice_date date NOT NULL,
    due_date date,
    total_amount numeric(18,2) NOT NULL DEFAULT 0,
    status varchar(30) NOT NULL DEFAULT 'UNPAID',
    note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX purchase_invoices_company_number_ux
    ON purchase_invoices(company_id, invoice_number);

CREATE TABLE purchase_invoice_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_invoice_id uuid NOT NULL REFERENCES purchase_invoices(id) ON DELETE CASCADE,
    variant_id uuid NOT NULL REFERENCES product_variants(id),
    qty numeric(18,3) NOT NULL,
    unit_cost numeric(18,2) NOT NULL,
    discount_amount numeric(18,2) NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE supplier_payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    supplier_id uuid NOT NULL REFERENCES suppliers(id),
    payment_date date NOT NULL,
    amount numeric(18,2) NOT NULL,
    method varchar(50),
    note text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE supplier_payment_allocations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_payment_id uuid NOT NULL REFERENCES supplier_payments(id) ON DELETE CASCADE,
    purchase_invoice_id uuid NOT NULL REFERENCES purchase_invoices(id),
    amount numeric(18,2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    name varchar(200) NOT NULL,
    phone varchar(50),
    email varchar(200),
    address text,
    loyalty_points numeric(18,2) NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE TABLE payment_methods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    name varchar(100) NOT NULL,
    code varchar(50),
    is_cash boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX payment_methods_company_code_ux
    ON payment_methods(company_id, code)
    WHERE code IS NOT NULL;

CREATE TABLE pos_registers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id uuid NOT NULL REFERENCES outlets(id),
    name varchar(100) NOT NULL,
    device_id varchar(100),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pos_shifts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    register_id uuid NOT NULL REFERENCES pos_registers(id),
    user_id uuid NOT NULL REFERENCES users(id),
    open_time timestamptz NOT NULL DEFAULT now(),
    close_time timestamptz,
    opening_cash numeric(18,2) NOT NULL DEFAULT 0,
    closing_cash numeric(18,2),
    status varchar(20) NOT NULL DEFAULT 'OPEN',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    outlet_id uuid NOT NULL REFERENCES outlets(id),
    shift_id uuid REFERENCES pos_shifts(id),
    customer_id uuid REFERENCES customers(id),
    service_order_id uuid,
    invoice_number varchar(50) NOT NULL,
    sale_datetime timestamptz NOT NULL DEFAULT now(),
    status varchar(30) NOT NULL DEFAULT 'COMPLETED',
    subtotal numeric(18,2) NOT NULL DEFAULT 0,
    discount_amount numeric(18,2) NOT NULL DEFAULT 0,
    tax_amount numeric(18,2) NOT NULL DEFAULT 0,
    total_amount numeric(18,2) NOT NULL DEFAULT 0,
    note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX sales_company_invoice_ux
    ON sales(company_id, invoice_number);

CREATE TABLE sale_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id uuid NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    variant_id uuid NOT NULL REFERENCES product_variants(id),
    qty numeric(18,3) NOT NULL,
    unit_price numeric(18,2) NOT NULL,
    discount_amount numeric(18,2) NOT NULL DEFAULT 0,
    line_total numeric(18,2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sale_payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id uuid NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    payment_method_id uuid NOT NULL REFERENCES payment_methods(id),
    amount numeric(18,2) NOT NULL,
    reference varchar(100),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE expense_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    name varchar(200) NOT NULL,
    code varchar(50),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX expense_categories_company_code_ux
    ON expense_categories(company_id, code)
    WHERE code IS NOT NULL;

CREATE TABLE expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    outlet_id uuid NOT NULL REFERENCES outlets(id),
    category_id uuid NOT NULL REFERENCES expense_categories(id),
    expense_date date NOT NULL,
    amount numeric(18,2) NOT NULL,
    payment_method_id uuid REFERENCES payment_methods(id),
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE service_objects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    customer_id uuid NOT NULL REFERENCES customers(id),
    type varchar(100),
    brand varchar(100),
    variant varchar(100),
    name varchar(200),
    description text,
    serial_number varchar(100),
    production_year int,
    color varchar(50),
    size varchar(50),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE TABLE services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    name varchar(200) NOT NULL,
    code varchar(50),
    default_price numeric(18,2) NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX services_company_code_ux
    ON services(company_id, code)
    WHERE code IS NOT NULL;

CREATE TABLE service_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id),
    outlet_id uuid NOT NULL REFERENCES outlets(id),
    customer_id uuid NOT NULL REFERENCES customers(id),
    service_object_id uuid NOT NULL REFERENCES service_objects(id),
    order_datetime timestamptz NOT NULL DEFAULT now(),
    status varchar(30) NOT NULL DEFAULT 'BOOKED',
    note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE service_order_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    service_order_id uuid NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
    service_id uuid NOT NULL REFERENCES services(id),
    qty numeric(18,2) NOT NULL DEFAULT 1,
    unit_price numeric(18,2) NOT NULL DEFAULT 0,
    line_total numeric(18,2) NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sales
    ADD CONSTRAINT sales_service_order_fk
    FOREIGN KEY (service_order_id)
    REFERENCES service_orders(id);

COMMIT;