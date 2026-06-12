import mysql from "mysql2/promise";
import { ENV } from "./env.js";

const pool = mysql.createPool(ENV.DB_URL);

export default pool;
