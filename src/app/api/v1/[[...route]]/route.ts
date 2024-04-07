import { auth } from '@/lib/controllers/middleware';
import redis from '@/lib/databases/redis.init';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import router from '@/lib/routers/index.router';
import { createRandomOTP, sendOTP } from '@services/email.service';

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

app.get('/email', auth, async (c) => {
    try {
        await sendOTP('nndang.sc@gmail.com', createRandomOTP());
        return c.json({ mess: 'ok' });
    } catch (error) {
        return c.json({ mess: 'error' }, { status: 400 });
    }
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
