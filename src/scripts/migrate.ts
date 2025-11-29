import fs from "fs";
import path from "path";
import Postgrator from "postgrator";
import env from "../config/env";
import { pool } from "../config/db";

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), "src/db/migrations");
  console.log("Running migrations from:", migrationsDir);

  try {
    const files = fs.existsSync(migrationsDir)
      ? fs.readdirSync(migrationsDir)
      : [];
    console.log("Found migration files:", files);
  } catch (err) {
    console.error("Unable to read migration directory:", err);
  }

  // pakai * aja, biar semua file di folder itu dicek Postgrator
  const migrationPattern = path.join(migrationsDir, "*").replace(/\\/g, "/");

  const postgrator = new Postgrator({
    migrationPattern,
    driver: "pg",
    database: env.db.name,
    schemaTable: "schema_version",
    // WAJIB di postgrator versi baru
    execQuery: (query: string) => pool.query(query),
  });

  try {
    const result = await postgrator.migrate("max");

    if (!result) {
      console.log("No migrations were run (already at max or no valid files).");
    } else {
      console.log("Migrations completed. Current version:", result.version);
    }

    process.exit(0);
  } catch (err: any) {
    console.error("Migration error:", err);
    if (err.appliedMigrations) {
      console.error("Applied migrations before error:", err.appliedMigrations);
    }
    process.exit(1);
  }
}

runMigrations();
