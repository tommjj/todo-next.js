import { auth } from '@/lib/controllers/middleware';
import redis from '@/lib/databases/redis.init';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import router from '@/lib/routers/index.router';
import { withError } from '@/lib/utils';
import prisma from '@/lib/databases/prisma.init';

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
app.get('/test1/:id', auth, async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const now = Date.now();
    const promise: Promise<any>[] = [];
    for (let i = 0; i < 50; i++) {
        promise.push(
            withError(prisma.list.findUnique)({
                where: {
                    id: id,
                    OR: [
                        { userId: user.id },
                        { Share: { some: { userId: user.id } } },
                    ],
                },
            })
        );
    }
    await Promise.allSettled(promise);
    console.log(Date.now() - now);

    return c.json({ time: Date.now() - now });
});

app.get('/test2/:id', auth, async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const now = Date.now();
    const [data, err] = await withError(prisma.list.findUnique)({
        where: {
            id: id,
            OR: [{ userId: user.id }, { Share: { some: { userId: user.id } } }],
        },
    });
    for (let i = 0; i < 50; i++) {
        const [data, err] = await withError(prisma.list.findUnique)({
            where: {
                id: id,
                OR: [
                    { userId: user.id },
                    { Share: { some: { userId: user.id } } },
                ],
            },
        });
    }
    console.log(Date.now() - now);

    return c.json({ time: Date.now() - now, data: data });
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
