import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { getTodo } from '../services/list.service';
import { withError } from '../utils';

const factory = new Factory();

/*
 * @path:: /lists
 * @method:: GET
 */
export const getAllListsDetailsHandler = factory.createHandlers(
    auth,
    async (c) => {
        const session = c.get('user');
        const [primaryList] = await getTodo(
            { userId: session.id },
            { id: true, name: true, userId: true, color: true }
        );

        const ListsPromise = await withError(prisma.list.findMany)({
            select: { id: true, name: true, userId: true, color: true },
            where: {
                NOT: {
                    id: primaryList?.id,
                },
                userId: session.id,
            },
        });

        const shareListsPromise = withError(prisma.list.findMany)({
            select: { id: true, name: true, userId: true, color: true },
            where: {
                Share: {
                    some: {
                        userId: session.id,
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
export const createListHandler = factory.createHandlers(auth, async (c) => {});

/*
 * @path:: /lists/:id
 * @method:: PATCH
 */
export const updateListHandler = factory.createHandlers(auth, async (c) => {
    const { id } = c.req.param();
});

/*
 * @path:: /lists/:id/subtask
 * @method:: POST
 */
export const createSubTaskHandler = factory.createHandlers(auth, async (c) => {
    const { id } = c.req.param();
});
