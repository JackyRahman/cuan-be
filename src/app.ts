import authRoutes from "./modules/auth/auth.route";
import companiesRoutes from "./modules/companies/companies.route";
import outletsRoutes from "./modules/outlets/outlets.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSecurity(app);
setupRequestLogger(app);

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/outlets", outletsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;