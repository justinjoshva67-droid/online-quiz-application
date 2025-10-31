import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

export default async function sendNotification(type, payload) {
  try {
    if (type === 'welcome') {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: payload.to,
        subject: 'Welcome to Online Quiz App',
        text: `Hi ${payload.name},\nWelcome to Online Quiz Application!`
      });
    } else if (type === 'submission') {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: payload.to,
        subject: 'Quiz Submission Confirmation',
        text: `Hi ${payload.name},\nYou have submitted quiz: ${payload.quizTitle}. Score: ${payload.score}/${payload.total}`
      });
    }
  } catch (err) {
    console.error('Email send failed', err);
    throw err;
  }
}
