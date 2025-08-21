       import dotenv from 'dotenv';
    dotenv.config();
    console.log("DB URL:", process.env.DATABASE_URL);
    console.log("ENV file loaded, DATABASE_URL:", process.env.DATABASE_URL);
   import pkg from "pg";
    const { Pool } = pkg;



    export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // set to { rejectUnauthorized: false } WHEN cloud hosting
    });

    export async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
    console.log('executed query', { text, duration, rows: res.rowCount });
    }
    return res;
    }