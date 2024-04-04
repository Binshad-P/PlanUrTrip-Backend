import nodeMailer from 'nodemailer'

const sendEmail = async (options) => {
    console.log(process.env.EMAIL_HOST_USER,'user');
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure: false, // Use SSL
        service:"gmail",
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD,
        },
    
        // Specify the authentication method
    });

    const mailOptions = {
        from: "mail.tefora@gmail.com",
        to: options.to,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail