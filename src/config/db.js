import mysql from "mysql2/promise";
import { ENV } from "./env.js";
import fs from "fs";

const pool = mysql.createPool({
  host: ENV.DB_HOST,
  port: parseInt(ENV.DB_PORT),
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,

  ssl: {
    ca: fs.readFileSync("./certs/ca.pem"),
  },
  connectTimeout: 20000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000
});

export default pool;
