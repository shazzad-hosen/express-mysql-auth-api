import { transporter } from "../config/mail.js";
import { ENV } from "../config/env.js";

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Auth API" <${ENV.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
