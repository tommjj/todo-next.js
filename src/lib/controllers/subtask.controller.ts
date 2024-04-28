import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { SubTaskCreateWithoutIdSchema } from '../zod.schema';
import { createSubTask as crSubTask } from '@services/subtask.service';
import { getListById } from '../services/list.service';
import { getTaskById } from '../services/task.service';

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

        const [task] = await getTaskById(
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
