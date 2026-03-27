import { transporter } from "../config/mail.js";
import { ENV } from "../config/env.js";

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Auth API" <${ENV.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });

    if (ENV.NODE_ENV === "development") {
      console.log("Email sent:", info.messageId);
    }

    return info;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};
