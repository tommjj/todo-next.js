import type { Account, CreateTask } from '@/lib/definitions';
import bcrypt from 'bcrypt';
import db from '../db/prisma.init';
import { Task, User } from '.prisma/client';

export async function createUser({
    username,
    email,
    password,
}: Account): Promise<[User, undefined] | [undefined, Error]> {
    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const user = await db.user.create({
            data: {
                name: username,
                email: email,
                password: hashPassword,
                List: {
                    create: {
                        name: 'Todo',
                    },
                },
            },
        });
        return [user, undefined];
    } catch (error) {
        return [undefined, error as Error];
    }
}

export async function createTask(
    data: CreateTask
): Promise<[Task, undefined] | [undefined, Error]> {
    try {
        const task = await db.task.create({
            data: {
                ...data,
            },
        });
        return [task, undefined];
    } catch (error) {
        return [undefined, error as Error];
    }
}
