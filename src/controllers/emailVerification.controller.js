import {
  verifyEmailOTP,
  resendVerificationOTP,
} from "../services/emailVerification.service.js";

export const verifyEmailOTPController = async (req, res) => {
  const result = await verifyEmailOTP(req.body);

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const resendVerificationController = async (req, res) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If email exists, OTP sent",
    });
  }

  const result = await resendVerificationOTP(email);

  res.status(200).json({
    success: true,
    ...result,
  });
};
