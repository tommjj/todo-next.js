import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { convertTime, withError } from '../utils';
import { CreateTaskSchema, TaskUpdateSchema } from '../zod.schema';
import {
    deleteTaskById,
    findTaskById,
    getAllImportantTasksByUserId,
    getAllPlannedTasksByUserId,
} from '../services/task.service';
import { Prisma } from '@prisma/client';

const factory = new Factory();

const TASK_SELECT = {
    id: true,
    title: true,
    important: true,
    completed: true,
    createAt: true,
    dueDate: true,
    repeatInterval: true,
    repeatCount: true,
    priority: true,
    subTasks: {
        orderBy: {
            createAt: 'asc',
        },
    },
    description: true,
    listId: true,
    order: true,
} satisfies Prisma.TaskSelect;
/*
 * @path:: /tasks
 * @method:: POST
 */
export const createTaskHandler = factory.createHandlers(
    auth,
    zValidator('json', CreateTaskSchema),
    async (c) => {
        const user = c.get('user');
        const body = c.req.valid('json');

        const { subTasks, dueDate, ...task } = body;
        //check
        const [list] = await withError(prisma.list.findUnique)({
            where: {
                id: task.listId,
                OR: [
                    {
                        userId: user.id,
                    },
                    { Share: { some: { userId: user.id } } },
                ],
            },
            select: {
                id: true,
            },
        });

        if (!list) return new Response(undefined, { status: 401 });
        // create
        const [data] = await withError(prisma.task.create)({
            data: {
                ...task,
                dueDate: convertTime(dueDate),
                subTasks: subTasks && {
                    createMany: {
                        data: subTasks,
                    },
                },
            },
            select: TASK_SELECT,
        });

        if (data) return c.json({ data: data }, 200);
    }
);

/*
 * @path:: /tasks/important
 * @method:: GET
 */
export const getAllImportantTaskHandler = factory.createHandlers(
    auth,
    async (c) => {
        const user = c.get('user');

        const [tasks] = await getAllImportantTasksByUserId(user.id);
        if (tasks)
            return c.json({
                data: {
                    tasks,
                },
            });
        return c.json(undefined, 500);
    }
);

/*
 * @path:: /tasks/planned
 * @method:: GET
 */
export const getAllPlannedTaskHandler = factory.createHandlers(
    auth,
    async (c) => {
        const user = c.get('user');

        const [tasks] = await getAllPlannedTasksByUserId(user.id);
        if (tasks)
            return c.json({
                data: {
                    tasks,
                },
            });
        return c.json(undefined, 500);
    }
);

/*
 * @path:: /tasks/search/:q
 * @method:: GET
 */
export const searchTasksHandler = factory.createHandlers(auth, async (c) => {
    const user = c.get('user');
    const q = c.req.param('q');

    const tasks = await prisma.task.findMany({
        select: TASK_SELECT,
        where: {
            title: {
                contains: q,
                mode: 'insensitive',
            },
            list: {
                OR: [
                    {
                        userId: user.id,
                    },
                    { Share: { some: { userId: user.id } } },
                ],
            },
        },
    });
    if (tasks.length > 0)
        return c.json({
            data: {
                tasks,
            },
        });
    return c.json(undefined, 404);
});

/*
 * @path:: /tasks/:id
 * @method:: PATCH
 */
export const updateTaskHandler = factory.createHandlers(
    auth,
    zValidator('json', TaskUpdateSchema),
    async (c) => {
        const user = c.get('user');
        const id = c.req.param('id');
        const body = c.req.valid('json');

        const { subTasks, ...task } = body;

        try {
            await prisma.task.update({
                data: {
                    ...task,
                    dueDate: convertTime(body.dueDate),
                },
                where: {
                    id: id,
                    list: {
                        OR: [
                            {
                                userId: user.id,
                            },
                            { Share: { some: { userId: user.id } } },
                        ],
                    },
                },
            });

            return c.json(undefined, 204);
        } catch (error) {
            return c.json(undefined, 410);
        }
    }
);

/*
 * @path:: /tasks/:id
 * @method:: DELETE
 */
export const deleteTaskHandler = factory.createHandlers(auth, async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const [task] = await findTaskById(
        { taskId: id, userId: user.id },
        { id: true }
    );

    if (!task) return c.json(undefined, 401);

    const err = await deleteTaskById(id);

    return c.json(undefined, err ? 401 : 204);
});
