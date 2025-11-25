import { Application } from "express";
import helmet from "helmet";
import cors from "cors";

export function setupSecurity(app: Application) {
  app.use(helmet());
  app.use(
    cors({
      origin: "*",
      credentials: false
    })
  );
}