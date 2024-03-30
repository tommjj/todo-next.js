import { auth } from '@/lib/controllers/middleware';
import redis from '@/lib/databases/redis.init';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import router from '@/lib/routers/index.router';

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

export const GET = handle(app);
// export const POST = handle(app)
