import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text, params) {
  const start = Date.now();

  const res = await pool.query(text, params);

  const duration = Date.now() - start;

  if (process.env.NODE_ENV !== "production") {
    console.log("executed query", {
      text,
      duration,
      rows: res.rowCount,
    });
  }

  return res;
}