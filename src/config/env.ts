import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    name: process.env.DB_NAME || "pos_app",
    user: process.env.DB_USER || "pos_user",
    password: process.env.DB_PASSWORD || "",
    ssl: process.env.DB_SSL === "true"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "change_me",
    expiresIn: process.env.JWT_EXPIRES_IN || "12h"
  }
};

export default env;