import pg from "pg";
import { config } from "../config/env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.db.url,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to the database");
    client.release();
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};
export const query = async (text, params) => pool.query(text, params);
