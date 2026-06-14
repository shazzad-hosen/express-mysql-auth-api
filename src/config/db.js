import mysql from "mysql2/promise";
import { ENV } from "./env.js";
import fs from "fs";

import net from "net";

const socket = net.createConnection({
  host: ENV.DB_HOST,
  port: Number(ENV.DB_PORT),
});

socket.on("connect", () => {
  console.log("TCP CONNECTED");
  socket.destroy();
});

socket.on("error", (err) => {
  console.error("TCP ERROR:", err);
});

socket.on("timeout", () => {
  console.error("TCP TIMEOUT");
  socket.destroy();
});

socket.setTimeout(10000);

const pool = mysql.createPool({
  host: ENV.DB_HOST,
  port: Number(ENV.DB_PORT),
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,

  ssl: {
    ca: fs.readFileSync("./certs/ca.pem"),
  },
  connectTimeout: 10000,
});

export default pool;
