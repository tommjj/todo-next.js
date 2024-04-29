import { Hono } from 'hono';
import { sendOtpHandler, verifyOTPHandler } from '@controllers/auth.controller';

const auth = new Hono();

/*
 * Base path: '/auth'
 */

auth.post('/email-verify', ...sendOtpHandler);

auth.post('/otp-verify', ...verifyOTPHandler);

export default auth;
