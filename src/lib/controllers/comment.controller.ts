import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { z } from 'zod';
import { CommentCreateSchema } from '../zod.schema';
import { noError, withError } from '../utils';
import { Prisma } from '@prisma/client';

const factory = new Factory();

const DEFAULT_COMMENT_SELECT = {
    id: true,
    createAt: true,
    text: true,
    taskId: true,
    User: {
        select: {
            id: true,
            name: true,
        },
    },
} satisfies Prisma.CommentSelect;

/*
 * @path:: /comments
 * @method:: POST
 */
export const createCommentHandler = factory.createHandlers(
    auth,
    zValidator('json', CommentCreateSchema),
    async (c) => {
        const user = c.get('user');
        const body = c.req.valid('json');

        const task = await noError(prisma.task.findUnique)({
            select: { id: true },
            where: {
                id: body.taskId,
                list: {
                    OR: [
                        { userId: user.id },
                        { Share: { some: { userId: user.id } } },
                    ],
                },
            },
        });

        if (!task) return c.json(undefined, 400);

        const data = await noError(prisma.comment.create)({
            select: DEFAULT_COMMENT_SELECT,
            data: {
                text: body.text,
                taskId: body.taskId,
                userId: user.id,
            },
        });

        if (!data) return c.json(undefined, 410);
        return c.json({ data: data });
    }
);

/*
 * @path:: /comments/:id
 * @method:: DELETE
 */
export const deleteCommentHandler = factory.createHandlers(auth, async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const [err] = await withError(prisma.comment.delete)({
        where: {
            id: id,
            userId: user.id,
        },
    });

    if (err) return c.json(undefined, 410);
    return c.json(undefined, 204);
});
