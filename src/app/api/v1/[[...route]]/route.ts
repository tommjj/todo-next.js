import { auth } from '@/lib/controllers/middleware';
import redis from '@/lib/databases/redis.init';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import router from '@/lib/routers/index.router';
import { sendOTP, verifyOTP } from '@/lib/services/otp.service';
import prisma from '@/lib/databases/prisma.init';
import jwt from 'jsonwebtoken';

const app = new Hono().basePath('/api/v1');

app.route('/', router);

app.get('/hello', auth, async (c) => {
    const { name } = c.get('user');

    let data: any = await redis.get(name);

    data = data ? Number(data) : 0;

    await redis.set(name, data + 1, 'EX', 5 * 60 * 1);

    return c.json({
        name: name,
        count: data,
    });
});

//! test
app.get('/email', auth, async (c) => {
    try {
        await sendOTP('nndang.sc@gmail.com');
        return c.json({ mess: 'ok' });
    } catch (error) {
        return c.json({ mess: (error as Error).message }, { status: 400 });
    }
});

//! test
app.get('/otp/:code', auth, async (c) => {
    const otp = c.req.param('code');

    const isValid = await verifyOTP('nndang.sc@gmail.com', otp);

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
});

//! test
app.get('/otp-token/:token', async (c) => {
    const token = c.req.param('token');
    try {
        const decoded = jwt.verify(token, process.env.AUTH_SECRET!);

        return c.json({ tokenParse: decoded });
    } catch (err) {
        return c.json(undefined, { status: 406 });
    }
});

//! test
app.get('/count/:listId/count', auth, async (c) => {
    c.json({ mess: 'hello' });
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
