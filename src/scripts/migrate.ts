import path from "path";
import Postgrator from "postgrator";
import { Pool } from "pg";
import env from "../config/env";

async function runMigrations() {
  const pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
    ssl: env.db.ssl ? { rejectUnauthorized: false } : false
  });

  const postgrator = new Postgrator({
    driver: "pg",
    migrationPattern: path.join(__dirname, "../db/migrations/*.*.sql"),
    schemaTable: "schema_version",
    execQuery: (query) => pool.query(query)
  });

  try {
    console.log("Running migrations...");
    const result = await postgrator.migrate("max");
    console.log("Migration finished at version:", result?.version);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();