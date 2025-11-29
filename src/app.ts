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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;