import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DB_CONNECTION;

if (!connectionString) {
  throw new Error("DB_CONNECTION is not configured in environment variables.");
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
