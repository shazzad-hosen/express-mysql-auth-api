import pool from "../config/db.js";

export const createPasswordReset = async ({ userId, otpHash, expiresAt }) => {
  const query = ` INSERT INTO password_resets (user_id, otp_hash, expires_at) VALUES (?, ?, ?) `;

  const [result] = await pool.execute(query, [userId, otpHash, expiresAt]);
  return result.insertId;
};

export const findPasswordResetByOtpHash = async (otpHash) => {
  const query = `  SELECT * FROM password_resets WHERE otp_hash = ? LIMIT 1 `;

  const [rows] = await pool.execute(query, [otpHash]);
  return rows[0] || null;
};

export const markResetTokenUsedById = async (id) => {
  const query = ` UPDATE password_resets SET is_used = TRUE WHERE id = ? `;

  await pool.execute(query, [id]);
};

export const deleteResetOTPByUserId = async (userId) => {
  const query = ` DELETE FROM password_resets WHERE user_id = ? `;

  await pool.execute(query, [userId]);
};
