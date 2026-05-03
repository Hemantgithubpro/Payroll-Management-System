import pg from "pg";

const { Pool } = pg;

const rawConnectionString =
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/payroll_system";
const needsSsl = rawConnectionString.includes("sslmode=require") || rawConnectionString.includes("db.prisma.io");

function connectionStringWithoutSslMode(value) {
  try {
    const url = new URL(value);
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return value;
  }
}

export const pool = new Pool({
  connectionString: needsSsl ? connectionStringWithoutSslMode(rawConnectionString) : rawConnectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined
});

export async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result;
}
