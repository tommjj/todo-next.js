import { Prisma } from '@prisma/client';
import { getSessionUser } from '../auth';
import prisma from '../databases/prisma.init';

import type { Lists } from '@/lib/definitions';

export const defaultListSelect = {
    id: true,
    name: true,
    color: true,
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
            priority: true,
            miniTasks: true,
            description: true,
            listId: true,
            order: true,
        },
        orderBy: {
            order: 'desc',
        },
    },
} satisfies Prisma.ListSelect;

/*
 * ----==== GET ====----
 */

export async function getListById<T extends Prisma.ListSelect>(
    { listId, userId }: { listId: string; userId?: string },
    select: T = defaultListSelect as T
): Promise<
    [undefined, Error] | [Prisma.ListGetPayload<{ select: T }>, undefined]
> {
    const list = await prisma.list.findUnique({
        select,
        where: { id: listId, userId: userId },
    });

    if (!list) return [undefined, new Error('not found')];

    return [list, undefined];
}

export async function getAllListsBySession(): Promise<
    [undefined, Error] | [Lists, undefined]
> {
    const user = await getSessionUser();
    if (!user) return [undefined, new Error('miss user')];

    const lists = await prisma.list.findMany({
        select: { id: true, name: true },
        where: { userId: user.id },
    });

    return [lists, undefined];
}

/*
 * ----==== DELETE ====----
 */

export async function deleteList(listId: string) {
    try {
        await prisma.miniTask.deleteMany({
            where: {
                task: {
                    listId: listId,
                },
            },
        });

        await prisma.task.deleteMany({
            where: {
                listId: listId,
            },
        });

        await prisma.list.delete({
            where: {
                id: listId,
            },
        });
        return undefined;
    } catch (err) {
        return err as Error;
    }
}
