import { Prisma } from '@prisma/client';
import db from '../db';
import { z } from 'zod';

export async function updateTask(
    id: string,
    data: Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>
) {
    await db.task.update({
        data: {
            ...data,
        },
        where: {
            id: id,
        },
    });
}
