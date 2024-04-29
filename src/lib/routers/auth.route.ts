import { Hono } from 'hono';
import { sendOtpHandler } from '@controllers/auth.controller';

const auth = new Hono();

/*
 * Base path: '/auth'
 */

auth.post('/email-verify', ...sendOtpHandler);

export default auth;
