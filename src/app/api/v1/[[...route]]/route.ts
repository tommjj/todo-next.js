import { auth } from '@/lib/controllers/middleware';
import redis from '@/lib/databases/redis.init';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import router from '@/lib/routers/index.router';
import {
    createRandomOTP,
    sendOTP,
    verifyOTP,
} from '@/lib/services/otp.service';

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

    return c.json({ mess: await verifyOTP('nndang.sc@gmail.com', otp) });
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
