import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.APP_PASSWOED,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Send an email using async/await

  const info = await transporter.sendMail({
    from: '"Health Care" <awoladh04@gmail.com>',
    to: email,
    subject: "Reset Password",
    // text: "", // Plain-text version of the message
    html, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};

export default emailSender;
