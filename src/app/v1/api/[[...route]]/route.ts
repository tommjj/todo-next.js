import { auth } from '@/lib/controllers/middleware';
import redis from '@/lib/databases/redis.init';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import router from '@/lib/routers/index.router';
import { sendOTP, verifyOTP } from '@/lib/services/otp.service';
import jwt from 'jsonwebtoken';

const app = new Hono().basePath('/v1/api/');

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
app.get('/lists/:listId/count', auth, async (c) => {
    return c.json({ mess: 'pares' });
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
