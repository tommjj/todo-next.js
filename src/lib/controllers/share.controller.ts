import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { withError } from '../utils';

const factory = new Factory();

/*
 * @path:: /share/lists/:id
 * @method:: GET
 */
export const getShareDetails = factory.createHandlers(auth, async (c) => {
    const user = c.get('user');
    const listId = c.req.param('id');

    const data = await prisma.list.findUnique({
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
            shareToken: true,
            Share: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        where: {
            id: listId,
            OR: [{ userId: user.id }, { Share: { some: { userId: user.id } } }],
        },
    });

    if (data) return c.json({ data: data }, 200);
    return c.json(undefined, 404);
});

/*
 * @path:: /share/lists/:id
 * @method:: POST
 */
// export const;
