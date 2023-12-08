import type { Account } from '@/lib/definitions';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { getSessionUser } from './auth';
import { $Enums, Prisma } from '@prisma/client';

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

type list = {
    id: string;
    name: string;
    tasks: ({
        miniTasks: {
            id: string;
            title: string;
            completed: boolean;
            taskId: string;
        }[];
    } & {
        id: string;
        title: string;
        important: boolean;
        completed: boolean;
        dueDate: Date;
        repeatInterval: $Enums.RepeatInterval;
        repeatCount: number | null;
        note: string | null;
        miniTasks: {
            id: string;
            title: string;
            completed: boolean;
            taskId: string;
        }[];
        level: $Enums.Level | null;
        listId: string;
        order: number;
    })[];
};

export async function getList(
    listId: string
): Promise<[undefined, Error] | [list, undefined]> {
    const user = await getSessionUser();

    if (!user) {
        return [undefined, new Error('miss user')];
    }

    const list = await db.list.findUnique({
        select: {
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
            },
        },
        where: { id: listId, userId: user.id },
    });

    if (!list) return [undefined, new Error('not found')];

    return [list, undefined];
}
