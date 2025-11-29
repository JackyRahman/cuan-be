import path from "path";
import Postgrator from "postgrator";
import env from "../config/env";

async function runMigrations() {
  const postgrator = new Postgrator({
    migrationPattern: path.join(__dirname, "../db/migrations/*.*.sql"),
    driver: "pg",
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    username: env.db.user,
    password: env.db.password,
    ssl: env.db.ssl ? { rejectUnauthorized: false } : undefined,
    schemaTable: "schema_version"
  });

  try {
    console.log("Running migrations...");
    const result = await postgrator.migrate("max");
    console.log("Migration finished at version:", result?.version);
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

runMigrations();