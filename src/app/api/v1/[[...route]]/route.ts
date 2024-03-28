import redis from '@/lib/db/redis.init';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono().basePath('/api/v1');

app.get('/hello/:name', async (c) => {
    const name = c.req.param('name');

    let data: any = await redis.get(name);

    data = data ? Number(data) : 0;

    await redis.set(name, data + 1, 'EX', 5 * 60 * 1000);

    return c.json({
        name: name,
        count: data,
    });
});

export const GET = handle(app);
// export const POST = handle(app)
