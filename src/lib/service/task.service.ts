import { Prisma } from '@prisma/client';
import prisma from '../database/prisma.init';

import type { CreateTask } from '@/lib/definitions';
import { Task } from '.prisma/client';

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

type TaskIdUserId = { taskId: string; userId?: string };

export async function getTaskById<T extends Prisma.TaskSelect>(
    { taskId, userId }: TaskIdUserId,
    select: T = defaultTaskSelect as T
): Promise<
    [undefined, Error] | [Prisma.TaskGetPayload<{ select: T }>, undefined]
> {
    const task = await prisma.task.findUnique({
        select,
        where: userId
            ? { id: taskId, list: { userId: userId } }
            : { id: taskId },
    });

    if (!task) return [undefined, new Error('not found')];

    return [task, undefined];
}

export async function createTask(
    data: CreateTask
): Promise<[Task, undefined] | [undefined, Error]> {
    try {
        const task = await prisma.task.create({
            data: {
                ...data,
            },
        });
        return [task, undefined];
    } catch (error) {
        return [undefined, error as Error];
    }
}

export async function updateTask(
    id: string,
    data: Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>
) {
    await prisma.task.update({
        data: {
            ...data,
        },
        where: {
            id: id,
        },
    });
}

export async function deleteTask(id: string) {
    try {
        await prisma.miniTask.deleteMany({
            where: {
                task: {
                    listId: id,
                },
            },
        });

        await prisma.task.delete({
            where: {
                id: id,
            },
        });
        return undefined;
    } catch (err) {
        return err as Error;
    }
}
