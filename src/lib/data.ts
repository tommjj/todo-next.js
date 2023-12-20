import type { Account, ListWithTasks } from '@/lib/definitions';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { getSessionUser } from './auth';
import { Prisma } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export async function createUser({ username, password }: Account) {
    const hashPassword = await bcrypt.hash(password, 10);

    try {
        await db.user.create({
            data: {
                name: username,
                password: hashPassword,
                List: {
                    create: {
                        name: 'Todo',
                    },
                },
            },
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function getUser(username: string) {
    try {
        return await db.user.findUnique({ where: { name: username } });
    } catch (error) {
        console.log((error as Error).message);
        return null;
    }
}

const defaultListSelect = {
    id: true,
    name: true,
    tasks: {
        select: {
            id: true,
            title: true,
            important: true,
            completed: true,
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
