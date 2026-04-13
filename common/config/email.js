import "dotenv/config"
import nodemailer from "nodemailer";

console.log(process.env.SMTP_HOST)
console.log(process.env.SMTP_PORT)

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    // auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    // },
});

const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to,
        subject,
        html,
    });
};

const sendVerificationEmail = async (to, token) => {
    const baseUrl = process.env.BASE_URL;
    const verificationUrl = `${baseUrl}/auth/verify-email/${token}`;
    const html = `
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    `;

    await sendMail(to, "Verify your email", html);
};

export { sendMail, sendVerificationEmail };
