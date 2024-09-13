const nodemailer = require('nodemailer');

const sendEmail = async ( email, subject, message ) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: message,
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully!' };
    } 
    catch (error) {
        return { success: false, message: 'Failed to send email' };
    }
}
module.exports = { sendEmail };