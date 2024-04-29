import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { z } from 'zod';
import { sendOTP, verifyOTP } from '../services/otp.service';
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
            await sendOTP(body.email);
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
    async (c) => {
        const body = c.req.valid('json');

        try {
            const otp = c.req.param('code');

            const isValid = await verifyOTP(body.email, body.otp);

            if (isValid) {
                const jwtToken = jwt.sign(
                    {
                        email: 'nndang.sc@gmail.com',
                    },
                    process.env.AUTH_SECRET!,
                    { expiresIn: 60 * 60 }
                );

                return c.json({ token: jwtToken });
            }
            return c.json(undefined, { status: 406 });

            return c.json(undefined, { status: 204 });
        } catch (error) {
            return c.json({ mess: (error as Error).message }, { status: 400 });
        }
    }
);
