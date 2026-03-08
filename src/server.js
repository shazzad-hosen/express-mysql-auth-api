import app from "./app.js";
import pool from "./config/db.js";
import { ENV } from "./config/env.js";

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected");
    connection.release();

    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();
