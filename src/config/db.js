import mysql from "mysql2/promise";
import { ENV } from "./env.js";

console.log(ENV.DB_PORT);
console.log(ENV.DB_HOST);
console.log(typeof ENV.DB_PORT);

const pool = mysql.createPool({
  host: ENV.DB_HOST,
  port: Number(ENV.DB_PORT),
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,

  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
