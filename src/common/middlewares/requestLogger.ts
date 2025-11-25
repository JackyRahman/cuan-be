import { Application } from "express";
import morgan from "morgan";

export function setupRequestLogger(app: Application) {
  app.use(morgan("dev"));
}