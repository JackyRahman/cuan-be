import express from "express";
import swaggerUi from "swagger-ui-express";
import { setupSecurity } from "./common/middlewares/security";
import { setupRequestLogger } from "./common/middlewares/requestLogger";
import { notFoundHandler } from "./common/middlewares/notFound";
import { errorHandler } from "./common/middlewares/errorHandler";
import { swaggerSpec } from "./docs/swagger";
import healthRoutes from "./modules/health/health.route";
import authRoutes from "./modules/auth/auth.route";
import companiesRoutes from "./modules/companies/companies.route";
import outletsRoutes from "./modules/outlets/outlets.route";
import categoriesRoutes from "./modules/categories/categories.route";
import brandsRoutes from "./modules/brands/brands.route";
import unitsRoutes from "./modules/units/units.route";
import productsRoutes from "./modules/products/products.route";
import warehousesRoutes from "./modules/warehouses/warehouses.route";
import inventoryRoutes from "./modules/inventory/inventory.route";
import salesRoutes from "./modules/sales/sales.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSecurity(app);
setupRequestLogger(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/outlets", outletsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/brands", brandsRoutes);
app.use("/units", unitsRoutes);
app.use("/products", productsRoutes);
app.use("/warehouses", warehousesRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/sales", salesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;