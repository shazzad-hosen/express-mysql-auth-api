import pool from "../config/db.js";

export const createPasswordReset = async ({ userId, tokenHash, expiresAt }) => {
  const query = ` INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?) `;

  const [result] = await pool.execute(query, [userId, tokenHash, expiresAt]);
  return result.insertId;
};

export const findPasswordResetByTokenHash = async (tokenHash) => {
  const query = ` SELECT * FROM password_resets WHERE token_hash = ? LIMIT 1 `;

  const rows = await pool.execute(query, [tokenHash]);
  return rows[0];
};

export const markResetTokenUsedById = async (id) => {
  const query = ` UPDATE password_resets SET is_used = TRUE WHERE id = ? `;

  await pool.execute(query, [id]);
};

export const deleteUserResetTokensByUserId = async (userId) => {
  const query = ` DELETE FROM password_resets WHERE user_id = ? `;

  await pool.execute(query, [userId]);
};
