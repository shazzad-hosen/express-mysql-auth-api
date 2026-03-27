import ApiError from "../utils/ApiError.js";
import { ENV } from "../config/env.js";
import { generateOtp, generateOtpHash } from "../utils/generateTokens.js";
import { sendEmail } from "../utils/sendEmail.js";
import { parseToMs } from "../utils/parseToMs.js";
import { findUserByEmail } from "../repositories/user.repository.js";

import {
  createEmailVerification,
  deleteVerificationByUserId,
  findVerificationByUserId,
  markUserVerifiedByUserId,
} from "../repositories/emailVerification.repository.js";

export const sendVerificationOTP = async (user) => {
  const otp = await generateOtp();

  const otpHash = await generateOtpHash(otp);

  const expiresAt = new Date(Date.now() + parseToMs(ENV.OTP_EXPIRY));

  await deleteVerificationByUserId(user.id);

  await createEmailVerification({
    userId: user.id,
    otpHash,
    expiresAt,
  });

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  });

  return {
    message: "Verification OTP sent",
  };
};

export const verifyEmailOTP = async (data) => {
  const { email, otp } = data;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(400, "Invalid request");
  }

  if (user.is_verified) {
    return {
      message: "Already verified",
    };
  }

  const otpHash = await generateOtpHash(otp);

  const record = await findVerificationByUserId(user.id);

  if (!record) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (new Date(record.expires_at) < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  if (record.otp_hash !== otpHash) {
    throw new ApiError(400, "Invalid OTP");
  }

  await markUserVerifiedByUserId(user.id);

  await deleteVerificationByUserId(user.id);

  return {
    message: "Email verified successfully",
  };
};

export const resendVerificationOTP = async (email) => {
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  
  const user = await findUserByEmail(email);

  if (!user) {
    return { message: "If email exists, OTP sent" };
  }

  if (user.is_verified) {
    return { message: "Already verified" };
  }

  return await sendVerificationOTP(user);
};
