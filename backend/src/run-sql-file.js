import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileName = process.argv[2];

if (!fileName) {
  console.error("Usage: node src/run-sql-file.js <schema.sql|seed.sql>");
  process.exit(1);
}

const sqlPath = path.resolve(__dirname, "../../database", fileName);

try {
  const sql = await fs.readFile(sqlPath, "utf8");
  await pool.query(sql);
  console.log(`Executed database/${fileName}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
