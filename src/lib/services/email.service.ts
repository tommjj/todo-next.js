import { HTML_OTP_TEMPLATE } from '../mailer/mail-template';
import transporter from '../mailer/mailer.init';

const OTP_EXPIRED_TIME_SECOND = 60 * 5;

export const createRandomOTP = () => {
    return Math.round(Math.random() * 1000000);
};

export const sendOTP = async (email: string, code: number) => {
    const options = {
        from: process.env.MAIL_USER || '', // * sender address
        to: email, // receiver email
        subject: 'Verify your email', // Subject line
        text: `Please use the following OTP to access the form ${code}. Do not share this OTP with any one.`,
        html: HTML_OTP_TEMPLATE(code),
    };

    const info = await transporter.sendMail(options);
};
