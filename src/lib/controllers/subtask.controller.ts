import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import {
    SubTaskCreateWithoutIdSchema,
    SubTaskUpdateSchema,
} from '../zod.schema';
import { createSubTask as crSubTask } from '@services/subtask.service';
import { findListById } from '../services/list.service';
import { findTaskById } from '../services/task.service';
import { withError } from '../utils';

const factory = new Factory();

/*
 * @path:: /subtask
 * @method:: POST
 */
export const createSubTask = factory.createHandlers(
    auth,
    zValidator('json', SubTaskCreateWithoutIdSchema),

    async (c) => {
        const user = c.get('user');
        const body = c.req.valid('json');

        if (!user.id) throw new Error('HOW ?');

        const [task] = await findTaskById(
            {
                taskId: body.taskId,
                userId: user.id,
            },
            { id: true }
        );

        if (!task) return c.json(undefined, { status: 400 });

        const [subTask, err] = await crSubTask({ ...body });

        return c.json({ data: subTask });
    }
);

const SubtaskWithoutId = SubTaskUpdateSchema.omit({ id: true });

/*
 * @path:: /subtask/:id
 * @method:: PATCH
 */
export const updateSubTask = factory.createHandlers(
    auth,
    zValidator('json', SubtaskWithoutId),

    async (c) => {
        const id = c.req.param('id');
        const user = c.get('user');
        const body = c.req.valid('json');

        if (!user.id) throw new Error('HOW ?');

        const func = withError(prisma.subTask.update);

        const [data, err] = await func({
            data: { ...body },
            where: {
                id: id,
                task: { list: { userId: user.id } },
            },
        });

        return c.json(undefined, { status: err ? 404 : 204 });
    }
);

/*
 * @path:: /subtask/:id
 * @method:: DELETE
 */

export const deleteSubtask = factory.createHandlers(auth, async (c) => {
    const id = c.req.param('id');
    const user = c.get('user');

    if (!user.id) throw new Error('HOW ?');

    const func = withError(prisma.subTask.delete);

    const [data, err] = await func({
        where: {
            id: id,
            task: { list: { userId: user.id } },
        },
    });

    return c.json(undefined, { status: err ? 404 : 204 });
});
