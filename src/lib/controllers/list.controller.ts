import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';

const factory = new Factory();

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
