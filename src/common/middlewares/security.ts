import { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import env from "../../config/env";

export function setupSecurity(app: Application) {
  const allowedOrigins = env.cors.allowedOrigins;

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Not allowed by CORS"));
      },
      credentials: allowedOrigins.some(o => o !== "*")
    })
  );
}