import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import {
    deleteList,
    findListById,
    getPrimaryList,
} from '../services/list.service';
import { withError } from '../utils';
import {
    ListCreateSchema,
    ListUpdateSchema,
    OrderTaskSchema,
} from '../zod.schema';
import { z } from 'zod';

const factory = new Factory();

/*
 * @path:: /lists
 * @method:: GET
 */
export const getAllListsDetailsHandler = factory.createHandlers(
    auth,
    async (c) => {
        const user = c.get('user');
        const [primaryList] = await getPrimaryList(user.id, {
            id: true,
            name: true,
            userId: true,
            color: true,
        });

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
 * @query:: [includeTasks: boolean]
 */
const querySchema = z.object({
    includeTasks: z.coerce.boolean().default(false),
});
export const getListHandler = factory.createHandlers(
    auth,
    zValidator('query', querySchema),
    async (c) => {
        const { includeTasks } = c.req.valid('query');
        const user = c.get('user');
        const id = c.req.param('id');

        const [list, err] = await findListById(
            {
                listId: id,
                userId: user.id,
            },
            includeTasks
                ? undefined
                : { id: true, color: true, name: true, userId: true }
        );

        if (list) return Response.json(list, { status: 200 });

        return Response.json({ message: err.message }, { status: 410 });
    }
);

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
 ! 
 */
export const updateOrderTaskInListHandler = factory.createHandlers(
    auth,
    zValidator('json', OrderTaskSchema),
    async (c) => {
        const id = c.req.param('id');
        const user = c.get('user');
        const body = c.req.valid('json');

        const data = await prisma.list.findUnique({
            select: {
                tasks: {
                    select: {
                        id: true,
                        order: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
            where: {
                id: id,
                OR: [
                    { userId: user.id },
                    { Share: { some: { userId: user.id } } },
                ],
            },
        });

        if (!data) return c.json(undefined, 410);

        const map = new Map<string, { id: string; order: number }>();

        data.tasks.forEach((i) => {
            map.set(i.id, i);
        });

        const promise: Promise<any>[] = [];

        let order = body.order.length;
        body.order.forEach((cur, ind) => {
            const task = map.get(cur);
            if (!task) return;
            if (task.order !== order) {
                promise.push(
                    prisma.task.update({
                        data: {
                            order: order,
                        },
                        where: {
                            id: task.id,
                        },
                    })
                );
            }
            order -= 1;
        });

        await Promise.allSettled(promise);

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
            where: {
                id,
                OR: [
                    {
                        userId: user.id,
                    },
                    { Share: { some: { userId: user.id } } },
                ],
            },
        });

        if (!list) return c.json(undefined, { status: 401 });

        const [data, err] = await withError(prisma.task.deleteMany)({
            where: { listId: id, completed: true },
        });

        return c.json(undefined, { status: err ? 401 : 204 });
    }
);
