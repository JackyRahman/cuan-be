import type {
  AddBarcodeDto,
  CreateProductDto,
  CreateProductWithRelationsDto,
  CreateVariantDto
} from "./products.dto";
import { query, withTransaction } from "../../config/db";
import { PoolClient } from "pg";

export interface ProductEntity {
  id: string;
  company_id: string;
  category_id: string | null;
  brand_id: string | null;
  name: string;
  code: string | null;
  description: string | null;
  is_service: boolean;
  is_active: boolean;
}

export interface ProductVariantEntity {
  id: string;
  product_id: string;
  name: string | null;
  sku: string | null;
  unit_id: string | null;
  cost_price: string;
  sell_price: string;
  is_active: boolean;
}

export interface ProductBarcodeEntity {
  id: string;
  variant_id: string;
  barcode: string;
  is_primary: boolean;
}

export interface ProductWithRelations extends ProductEntity {
  variants: Array<ProductVariantEntity & { barcodes: ProductBarcodeEntity[] }>;
}

export async function createProduct(
  payload: CreateProductDto & { companyId: string }
): Promise<ProductEntity> {
  const rows = await query<ProductEntity>(
    `INSERT INTO products (company_id, category_id, brand_id, name, code, description, is_service)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      payload.companyId,
      payload.categoryId || null,
      payload.brandId || null,
      payload.name,
      payload.code || null,
      payload.description || null,
      payload.isService ?? false
    ]
  );
  return rows[0];
}

export async function listProducts(companyId: string): Promise<any[]> {
  const rows = await query<any>(
    `
    SELECT
      p.id as product_id,
      p.name as product_name,
      p.code as product_code,
      p.is_service,
      p.is_active,
      v.id as variant_id,
      v.name as variant_name,
      v.sku,
      v.sell_price,
      v.cost_price,
      b.id as barcode_id,
      b.barcode,
      b.is_primary
    FROM products p
    LEFT JOIN product_variants v ON v.product_id = p.id AND v.deleted_at IS NULL
    LEFT JOIN product_barcodes b ON b.variant_id = v.id
    WHERE p.company_id = $1
      AND p.deleted_at IS NULL
    ORDER BY p.name, v.name
    `,
    [companyId]
  );

  const productsMap = new Map<string, any>();

  for (const row of rows) {
    if (!productsMap.has(row.product_id)) {
      productsMap.set(row.product_id, {
        id: row.product_id,
        name: row.product_name,
        code: row.product_code,
        is_service: row.is_service,
        is_active: row.is_active,
        variants: []
      });
    }

    const product = productsMap.get(row.product_id);

    if (row.variant_id) {
      let variant = product.variants.find((v: any) => v.id === row.variant_id);
      if (!variant) {
        variant = {
          id: row.variant_id,
          name: row.variant_name,
          sku: row.sku,
          sell_price: row.sell_price,
          cost_price: row.cost_price,
          barcodes: []
        };
        product.variants.push(variant);
      }

      if (row.barcode_id) {
        variant.barcodes.push({
          id: row.barcode_id,
          barcode: row.barcode,
          is_primary: row.is_primary
        });
      }
    }
  }

  return Array.from(productsMap.values());
}

export async function createVariant(payload: CreateVariantDto): Promise<ProductVariantEntity> {
  const rows = await query<ProductVariantEntity>(
    `INSERT INTO product_variants (product_id, name, sku, unit_id, cost_price, sell_price)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      payload.productId,
      payload.name || null,
      payload.sku || null,
      payload.unitId || null,
      payload.costPrice ?? 0,
      payload.sellPrice ?? 0
    ]
  );
  return rows[0];
}

export async function addBarcode(payload: AddBarcodeDto): Promise<ProductBarcodeEntity> {
  if (payload.isPrimary) {
    await query(
      `UPDATE product_barcodes
          SET is_primary = false
        WHERE variant_id = $1`,
      [payload.variantId]
    );
  }

  const rows = await query<ProductBarcodeEntity>(
    `INSERT INTO product_barcodes (variant_id, barcode, is_primary)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [payload.variantId, payload.barcode, payload.isPrimary ?? false]
  );
  return rows[0];
  }

function insertProduct(client: PoolClient, payload: CreateProductDto & { companyId: string }) {
  return client.query<ProductEntity>(
    `INSERT INTO products (company_id, category_id, brand_id, name, code, description, is_service)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      payload.companyId,
      payload.categoryId || null,
      payload.brandId || null,
      payload.name,
      payload.code || null,
      payload.description || null,
      payload.isService ?? false
    ]
  );
}

function insertVariant(client: PoolClient, payload: CreateVariantDto) {
  return client.query<ProductVariantEntity>(
    `INSERT INTO product_variants (product_id, name, sku, unit_id, cost_price, sell_price)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      payload.productId,
      payload.name || null,
      payload.sku || null,
      payload.unitId || null,
      payload.costPrice ?? 0,
      payload.sellPrice ?? 0
    ]
  );
}

async function insertBarcode(
  client: PoolClient,
  payload: Omit<AddBarcodeDto, "variantId"> & { variantId: string }
) {
  if (payload.isPrimary) {
    await client.query(`UPDATE product_barcodes SET is_primary = false WHERE variant_id = $1`, [
      payload.variantId
    ]);
  }

  return client.query<ProductBarcodeEntity>(
    `INSERT INTO product_barcodes (variant_id, barcode, is_primary)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [payload.variantId, payload.barcode, payload.isPrimary ?? false]
  );
}

export async function createProductWithRelations(
  payload: CreateProductWithRelationsDto & { companyId: string }
): Promise<ProductWithRelations> {
  return withTransaction<ProductWithRelations>(async (client) => {
    const productRes = await insertProduct(client, payload);
    const product = productRes.rows[0];

    const variants: Array<ProductVariantEntity & { barcodes: ProductBarcodeEntity[] }> = [];

    for (const variant of payload.variants) {
      const variantRes = await insertVariant(client, {
        ...variant,
        productId: product.id
      });
      const variantEntity = variantRes.rows[0];

      const barcodes: ProductBarcodeEntity[] = [];
      if (variant.barcodes && variant.barcodes.length > 0) {
        for (const barcode of variant.barcodes) {
          const barcodeRes = await insertBarcode(client, {
            ...barcode,
            variantId: variantEntity.id
          });
          barcodes.push(barcodeRes.rows[0]);
        }
      }

      variants.push({ ...variantEntity, barcodes });
    }

    return { ...product, variants };
  });
}