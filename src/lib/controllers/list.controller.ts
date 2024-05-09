import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { deleteList, getTodo } from '../services/list.service';
import { withError } from '../utils';
import {
    ListCreateSchema,
    ListUpdateSchema,
    OrderTaskSchema,
} from '../zod.schema';

const factory = new Factory();

/*
 * @path:: /lists
 * @method:: GET
 */
export const getAllListsDetailsHandler = factory.createHandlers(
    auth,
    async (c) => {
        const user = c.get('user');
        const [primaryList] = await getTodo(
            { userId: user.id },
            { id: true, name: true, userId: true, color: true }
        );

        const ListsPromise = withError(prisma.list.findMany)({
            select: { id: true, name: true, userId: true, color: true },

            where: {
                NOT: {
                    id: primaryList?.id,
                },
                userId: user.id,
            },
        });

        const shareListsPromise = withError(prisma.list.findMany)({
            select: { id: true, name: true, userId: true, color: true },

            where: {
                Share: {
                    some: {
                        userId: user.id,
                    },
                },
            },
        });

        const [[Lists], [shareLists]] = await Promise.all([
            ListsPromise,
            shareListsPromise,
        ]);

        return c.json({
            data: {
                primary: primaryList,
                lists: Lists || [],
                shareLists: shareLists || [],
            },
        });
    }
);

/*
 * @path:: /lists/:id
 * @method:: GET
 */
export const getListHandler = factory.createHandlers(auth, async (c) => {
    const { id } = c.req.param();

    return c.json({ list: id });
});

/*
 * @path:: /lists
 * @method:: POST
 */
export const createListHandler = factory.createHandlers(
    auth,
    zValidator('json', ListCreateSchema),
    async (c) => {
        const user = c.get('user');
        const body = c.req.valid('json');

        const [data, err] = await withError(prisma.list.create)({
            data: {
                ...body,
                userId: user.id,
            },
        });

        if (!data) return c.json(undefined, 500);

        return c.json({ data: data });
    }
);

/*
 * @path:: /lists/:id
 * @method:: PATCH
 */
export const updateListHandler = factory.createHandlers(
    auth,
    zValidator('json', ListUpdateSchema),
    async (c) => {
        const body = c.req.valid('json');
        const user = c.get('user');
        const { id } = c.req.param();

        const [data, err] = await withError(prisma.list.update)({
            data: body,
            where: {
                id: id,
                userId: user.id,
            },
        });

        return c.json(undefined, err ? 401 : 204);
    }
);

/*
 * @path:: /lists/:id/order
 * @method:: PATCH
 */
export const updateOrderTaskInListHandler = factory.createHandlers(
    auth,
    zValidator('json', OrderTaskSchema),
    async (c) => {
        const id = c.req.param('id');
        const user = c.get('user');
        const body = c.req.valid('json');

        return c.json(undefined, 204);
    }
);

/*
 * @path:: /lists/:id
 * @method:: DELETE
 */
export const deleteListHandler = factory.createHandlers(auth, async (c) => {
    const { id } = c.req.param();
    const user = c.get('user');

    const list = await prisma.list.findUnique({
        select: { id: true },
        where: { id, userId: user.id },
    });

    if (!list) return c.json(undefined, { status: 401 });

    const err = await deleteList(id);

    return c.json(undefined, { status: err ? 401 : 204 });
});

/*
 * @path:: /lists/:id/clear
 * @method:: DELETE
 */
export const clearAllCompletedTaskInListHandler = factory.createHandlers(
    auth,
    async (c) => {
        const { id } = c.req.param();
        const user = c.get('user');

        const list = await prisma.list.findUnique({
            select: { id: true },
            where: { id, userId: user.id },
        });

        if (!list) return c.json(undefined, { status: 401 });

        const [data, err] = await withError(prisma.task.deleteMany)({
            where: { listId: id, completed: true },
        });

        return c.json(undefined, { status: err ? 401 : 204 });
    }
);
