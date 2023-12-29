'use client';

import { List, ListSchema, TaskUpdate } from './zod.schema';

export async function getListById(
    id: string
): Promise<[undefined, unknown] | [List, undefined]> {
    try {
        const data = await (await fetch(`/api/lists/${id}`)).json();

        const dataParse = ListSchema.safeParse(data);

        if (dataParse.success) {
            return [dataParse.data, undefined];
        } else {
            return [undefined, new Error("can't parse")];
        }
    } catch (error) {
        return [undefined, error];
    }
}

export function updateTaskById(id: string, task: TaskUpdate) {
    return fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            ...task,
        } satisfies TaskUpdate),
    });
}

export async function deleteTaskById(id: string) {
    return fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
    });
}
