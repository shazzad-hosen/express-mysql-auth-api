import pool from "../config/db.js";

export const createRefreshToken = async ({
  userId,
  tokenHash,
  expiresAt,
  user_agent,
  ip,
}) => {
  const query = ` INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip)VALUES (?, ?, ?, ?, ?) `;

  const [result] = await pool.execute(query, [
    userId,
    tokenHash,
    expiresAt,
    user_agent || null,
    ip || null,
  ]);

  return result.insertId;
};

export const findRefreshToken = async (tokenHash) => {
  const query = ` SELECT * FROM refresh_tokens WHERE token_hash = ? LIMIT 1 `;

  const [rows] = await pool.execute(query, [tokenHash]);

  return rows[0];
};

export const deleteRefreshToken = async (id) => {
  const query = ` DELETE FROM refresh_tokens WHERE id = ? `;

  await pool.execute(query, [id]);
};
