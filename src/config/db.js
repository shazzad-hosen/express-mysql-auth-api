import mysql from "mysql2/promise";
import { ENV } from "./env.js";

console.log({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
  database: ENV.DB_NAME,
});

const pool = mysql.createPool({
  host: ENV.DB_HOST,
  port: Number(ENV.DB_PORT),
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,

  ssl: {
    rejectUnauthorized: false,
  },
  connectTimeout: 10000,
});

export default pool;
