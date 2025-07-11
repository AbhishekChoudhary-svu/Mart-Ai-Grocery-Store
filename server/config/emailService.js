import http from 'http';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP server
    port: 465, // Replace with your SMTP port
    secure: true, // true for 465, false for other ports
    auth: {
        user : process.env.EMAIL_USER, // Replace with your email user
        pass : process.env.EMAIL_PASS // Replace with your email password
    }
});

async function sendEmail(sendTo, subject, text, html) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // sender address
            to: sendTo, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html // html body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}

export {sendEmail};
