import env from "./config/env";
import app from "./app";
import { pool } from "./config/db";

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");

    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();