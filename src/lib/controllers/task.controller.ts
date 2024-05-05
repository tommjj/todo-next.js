import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { convertTime, withError } from '../utils';
import { CreateTaskSchema } from '../zod.schema';
import { getAllImportantTasksByUserId } from '../services/task.service';

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
};
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
                userId: user.id,
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
            select: {
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
            },
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