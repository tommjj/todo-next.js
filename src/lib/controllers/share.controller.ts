import { Factory } from 'hono/factory';
import { auth } from './middleware';
import prisma from '../databases/prisma.init';
import { getPrimaryList } from '../services/list.service';
import { createRandString } from '../utils';

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
export const createNewShareListToken = factory.createHandlers(
    auth,
    async (c) => {
        const user = c.get('user');
        const listId = c.req.param('id');

        const [primary, err] = await getPrimaryList(user.id, { id: true });
        if (err) return c.json(undefined, 500);

        const token = createRandString(80);

        try {
            const list = await prisma.list.update({
                select: {
                    shareToken: true,
                },
                data: {
                    shareToken: token,
                },
                where: {
                    id: listId,
                    userId: user.id,
                    NOT: {
                        id: primary.id,
                    },
                },
            });

            return c.json({ data: list });
        } catch (err) {
            return c.json(undefined, 500);
        }
    }
);

/*
 * @path:: /share/lists/:id/token
 * @method:: DELETE
 */
export const removeShareListToken = factory.createHandlers(auth, async (c) => {
    const user = c.get('user');
    const listId = c.req.param('id');

    try {
        await prisma.list.update({
            data: {
                shareToken: null,
            },
            where: {
                userId: user.id,
                id: listId,
            },
        });

        return c.json(undefined, 204);
    } catch (err) {
        return c.json(undefined, 500);
    }
});
