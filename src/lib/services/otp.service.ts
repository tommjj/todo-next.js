import { Options as MailOptions } from 'nodemailer/lib/mailer';
import redis from '../databases/redis.init';

import { HTML_OTP_TEMPLATE } from '../mailer/mail-template';
import transporter from '../mailer/mailer.init';

const OTP_EXPIRED_TIME_SECOND = 60 * 5;
const CACHE_EXPIRED_TIME_SECOND = 60 * 60;
const MAX_OTP_PER_EMAIL = 1;

export const createRandomOTP = () => {
    const otp = Math.round(Math.random() * 1000000);

    let otpString = otp.toString();

    while (otpString.length < 6) otpString = '0' + otpString;

    return otpString;
};

export const sendOTP = async (email: string) => {
    const otp = createRandomOTP();

    const options: MailOptions = {
        from: process.env.MAIL_USER || '', // * sender address
        to: email, // receiver email
        subject: 'Verify your email', // Subject line
        text: `Please use the following OTP to access the form ${otp}. Do not share this OTP with any one.`,
        html: HTML_OTP_TEMPLATE(otp),
    };

    const count = Number((await redis.hget(email, 'count')) || 0);

    if (count >= MAX_OTP_PER_EMAIL) {
        throw new Error('MAXIMUM SEND LIMIT');
    }

    const info = await transporter.sendMail(options);

    redis.hset(email, {
        otp: otp,
        expireAt: Date.now() + OTP_EXPIRED_TIME_SECOND * 1000,
    });
    redis.hincrby(email, 'count', 1);
    redis.expire(email, CACHE_EXPIRED_TIME_SECOND);
};

export const verifyOTP = async (email: string, otp: number | string) => {
    const isExpired =
        Number((await redis.hget(email, 'expireAt')) || 0) <= Date.now();

    if (isExpired) return false;
    return (await redis.hget(email, 'otp')) === otp.toString();
};
