import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sql = neon(process.env.DATABASE_URL);

function loadSql(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

async function runFile(relativePath) {
  const statements = loadSql(relativePath)
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const target = process.argv[2];
  if (target === "migrate") {
    await runFile("db/migrations/002_booking_lifecycle.sql");
    console.log("Migration complete.");
    return;
  }

  if (target === "seed") {
    await runFile("db/seed.sql");
    console.log("Seed complete.");
    return;
  }

  if (target === "setup") {
    await runFile("db/migrations/001_initial.sql");
    await runFile("db/migrations/002_booking_lifecycle.sql");
    await runFile("db/seed.sql");
    console.log("Database setup complete.");
    return;
  }

  throw new Error("Usage: node scripts/db-run.mjs <migrate|seed|setup>");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
