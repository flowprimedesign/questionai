import pg from "pg";
import "./dotenv.js";

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
};

if (
  process.env.PGHOST &&
  !["localhost", "127.0.0.1"].includes(process.env.PGHOST)
) {
  config.ssl = config.ssl || { rejectUnauthorized: false };
}

export const pool = new pg.Pool(config);
