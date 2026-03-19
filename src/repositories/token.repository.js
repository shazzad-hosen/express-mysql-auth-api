import pool from "../config/db.js";

export const createRefreshToken = async ({
  userId,
  tokenHash,
  expiresAt,
  userAgent,
  ip,
}) => {
  const query = ` INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip)VALUES (?, ?, ?, ?, ?) `;

  const [result] = await pool.execute(query, [
    userId,
    tokenHash,
    expiresAt,
    userAgent || null,
    ip || null,
  ]);

  return result.insertId;
};

export const findRefreshTokenByHash = async (tokenHash) => {
  const query = ` SELECT * FROM refresh_tokens WHERE token_hash = ? LIMIT 1 `;

  const [rows] = await pool.execute(query, [tokenHash]);

  return rows[0];
};

export const deleteRefreshTokenById = async (id, userId) => {
  const query = ` DELETE FROM refresh_tokens WHERE id = ? AND user_id = ? `;

  const [result] = await pool.execute(query, [id, userId]);
  return result.affectedRows > 0;
};

export const deleteRefreshTokenByHash = async (tokenHash) => {
  const query = ` DELETE FROM refresh_tokens WHERE token_hash = ? `;

  await pool.execute(query, [tokenHash]);
};

export const deleteRefreshTokenByUserId = async (userId) => {
  const query = ` DELETE FROM refresh_tokens WHERE user_id = ? `;

  await pool.execute(query, [userId]);
};

export const findSessionsByUserId = async (userId) => {
  const query = ` SELECT id, user_agent, ip, expires_at, created_at FROM refresh_tokens WHERE user_id = ? ORDER BY created_at DESC `;

  const [rows] = await pool.execute(query, [userId]);
  return rows;
};
