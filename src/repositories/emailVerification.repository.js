import pool from "../config/db.js";

export const createEmailVerification = async ({
  userId,
  otpHash,
  expiresAt,
}) => {
  const query = ` INSERT INTO email_verifications (user_id, otp_hash, expires_at) VALUES (?, ?, ?) `;

  await pool.execute(query, [userId, otpHash, expiresAt]);
};

export const findVerificationByUserId = async (userId) => {
  const query = ` SELECT * FROM email_verifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1 `;

  const [rows] = await pool.execute(query, [userId]);
  return rows[0] || null;
};

export const deleteVerificationByUserId = async (userId) => {
  const query = ` DELETE FROM email_verifications WHERE user_id = ? `;

  await pool.execute(query, [userId]);
};

export const markUserVerifiedByUserId = async (userId) => {
  const query = ` UPDATE users SET is_verified = TRUE WHERE id = ? `;

  await pool.execute(query, [userId]);
};
