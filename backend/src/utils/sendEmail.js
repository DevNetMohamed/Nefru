import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransporter() {
  if (!env.mailerEmail || !env.mailerPassword) {
    throw new Error("Mailer credentials are not configured");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.mailerHost,
      port: env.mailerPort,
      secure: env.mailerPort === 465,
      auth: {
        user: env.mailerEmail,
        pass: env.mailerPassword,
      },
    });
  }

  return transporter;
}

export const sendEmail = async (options) => {
  const mailOptions = {
    from: `Nefru <${env.mailerEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await getTransporter().sendMail(mailOptions);
};
