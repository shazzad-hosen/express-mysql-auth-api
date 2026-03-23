import pool from "../config/db.js";

export const createUser = async ({ email, passwordHash }) => {
  const query = ` INSERT INTO users (email, password_hash) VALUES (?, ?) `;

  const [result] = await pool.execute(query, [email, passwordHash]);

  return {
    id: result.insertId,
    email,
  };
};

export const findUserByEmail = async (email) => {
  const query = ` SELECT * FROM users WHERE email = ? LIMIT 1 `;

  const [rows] = await pool.execute(query, [email]);

  return rows[0];
};

export const findUserById = async (id) => {
  const query = ` SELECT id, email, role, is_verified FROM users WHERE id = ? `;

  const [rows] = await pool.execute(query, [id]);

  return rows[0];
};

export const findDataById = async (userId) => {
  const query = ` SELECT id, password_hash FROM users WHERE id = ? `;

  const [rows] = await pool.execute(query, [userId]);
  return rows[0];
};

export const updateUserPassword = async (userId, passwordHash) => {
  const query = ` UPDATE users SET password_hash = ? WHERE id = ? `;

  await pool.execute(query, [passwordHash, userId]);
};
