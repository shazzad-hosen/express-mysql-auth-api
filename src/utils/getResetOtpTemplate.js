export const getResetOtpTemplate = (otp) => {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Password Reset Code</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;
};
