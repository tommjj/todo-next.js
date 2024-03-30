import { Hono } from 'hono';
import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';

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
