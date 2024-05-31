import { Factory } from 'hono/factory';
import { auth, delay } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { z } from 'zod';
import { sendCreateAccountOTP, verifyOTP } from '../services/otp.service';
import jwt from 'jsonwebtoken';

const factory = new Factory();

/*
 * @path:: /auth/email-verify
 * @method:: POST
 */
export const sendOtpHandler = factory.createHandlers(
    zValidator('json', z.object({ email: z.string().email() })),
    async (c) => {
        const body = c.req.valid('json');

        try {
            await sendCreateAccountOTP(body.email);
            return c.json(undefined, { status: 204 });
        } catch (error) {
            return c.json({ mess: (error as Error).message }, { status: 400 });
        }
    }
);

/*
 * @path:: /auth/otp-verify
 * @method:: POST
 */
export const verifyOTPHandler = factory.createHandlers(
    zValidator(
        'json',
        z.object({ otp: z.string().length(6), email: z.string().email() })
    ),
    delay(200),
    async (c) => {
        const body = c.req.valid('json');

        const isValid = await verifyOTP(body.email, body.otp);

        if (isValid) {
            const jwtToken = jwt.sign(
                {
                    email: body.email,
                },
                process.env.AUTH_SECRET!,
                { expiresIn: 60 * 60 }
            );

            return c.json({ token: jwtToken });
        }
        return c.json(undefined, { status: 406 });
    }
);
