import type { Lists } from '@/lib/definitions';
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

export const defaultListSelect: Prisma.ListSelect = {
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
};

export async function getList<T extends Prisma.ListSelect>(
    listId: string,
    select: T = defaultListSelect as T
): Promise<
    [undefined, Error] | [Prisma.ListGetPayload<{ select: T }>, undefined]
> {
    const user = await getSessionUser();

    if (!user) return [undefined, new Error('miss user')];

    const list = await db.list.findUnique({
        select,
        where: { id: listId, userId: user.id },
    });

    if (!list) return [undefined, new Error('not found')];

    return [list, undefined];
}

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

export async function getTask<T extends Prisma.TaskSelect>(
    id: string,
    select: T = defaultTaskSelect as T
): Promise<
    [undefined, Error] | [Prisma.TaskGetPayload<{ select: T }>, undefined]
> {
    const user = await getSessionUser();
    if (!user) return [undefined, new Error('miss user')];

    const task = await db.task.findUnique({
        select,
        where: { id: id, list: { userId: user.id } },
    });

    if (!task) return [undefined, new Error('not found')];

    return [task, undefined];
}
