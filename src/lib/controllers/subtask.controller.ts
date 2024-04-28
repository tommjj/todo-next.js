import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { SubTaskCreateWithoutIdSchema } from '../zod.schema';

const factory = new Factory();

/*
 * @path:: /subtask
 * @method:: POST
 */
export const createSubTask = factory.createHandlers(
    auth,
    zValidator('json', SubTaskCreateWithoutIdSchema),

    async (c) => {
        const body = c.req.valid('json');

        return c.json({ mess: body });
    }
);
