const nodemailer = require("nodemailer");

async function sendLoginNotification(user) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS || !process.env.LOGIN_NOTIFY_TO) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT || 465),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const userName = user.name || user.username || user.email || "Bilinmeyen kullanıcı";

  await transporter.sendMail({
    from: `"Clover Moments" <${process.env.MAIL_USER}>`,
    to: process.env.LOGIN_NOTIFY_TO,
    subject: `${userName} giriş yaptı`,
    text: `${userName} adlı kişi Clover Moments sitesine giriş yaptı.`,
  });
}

module.exports = sendLoginNotification;