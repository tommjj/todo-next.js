'use client';

import { ListWithTasks } from './definitions';
import { ListSchema } from './zod.schema';

export async function getListById(
    id: string
): Promise<[undefined, unknown] | [ListWithTasks, undefined]> {
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
