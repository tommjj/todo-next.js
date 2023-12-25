import type { ListWithTasks, Task } from '@/lib/definitions';
import db from '@/lib/db';
import { getSessionUser } from '../auth';
import { Prisma } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export async function getUser(username: string) {
    try {
        return await db.user.findUnique({ where: { name: username } });
    } catch (error) {
        console.log((error as Error).message);
        return null;
    }
}

//********************* */
//*********list******** */
//********************* */

const defaultListSelect = {
    id: true,
    name: true,
    userId: true,
    tasks: {
        select: {
            id: true,
            title: true,
            important: true,
            completed: true,
            createAt: true,
            dueDate: true,
            repeatInterval: true,
            repeatCount: true,
            note: true,
            miniTasks: true,
            level: true,
            listId: true,
            order: true,
        },
        orderBy: {
            order: 'desc',
        },
    },
} satisfies Prisma.ListSelect;

export async function getList(
    listId: string,
    select: Prisma.ListSelect = defaultListSelect
): Promise<[undefined, Error] | [ListWithTasks, undefined]> {
    const user = await getSessionUser();

    if (!user) return [undefined, new Error('miss user')];

    const list = await db.list.findUnique({
        select,
        where: { id: listId, userId: user.id },
    });

    if (!list) return [undefined, new Error('not found')];

    const typedList = list as ListWithTasks;
    return [typedList, undefined];
}

export type Lists = { id: string; name: string }[];

export async function getLists(): Promise<
    [undefined, Error] | [Lists, undefined]
> {
    const user = await getSessionUser();

    if (!user) {
        return [undefined, new Error('miss user')];
    }

    const lists = await db.list.findMany({
        select: { id: true, name: true },
        where: { userId: user.id },
    });

    return [lists, undefined];
}

//************************ */
//*******===task===******* */
//************************ */

const defaultTaskSelect = {
    id: true,
    title: true,
    important: true,
    completed: true,
    createAt: true,
    dueDate: true,
    repeatInterval: true,
    repeatCount: true,
    note: true,
    miniTasks: true,
    level: true,
    listId: true,
    order: true,
} satisfies Prisma.TaskSelect;

export async function getTask(
    id: string,
    select: Prisma.TaskSelect = defaultTaskSelect
): Promise<[undefined, Error] | [Task, undefined]> {
    const user = await getSessionUser();
    if (!user) return [undefined, new Error('miss user')];

    const task = await db.task.findUnique({
        select,
        where: { id: id, list: { userId: user.id } },
    });

    if (!task) return [undefined, new Error('not found')];

    const typedTask = task as Task;
    return [typedTask, undefined];
}
