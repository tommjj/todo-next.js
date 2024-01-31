'use client';

import { List, ListSchema, TaskUpdate } from './zod.schema';

import { User } from './zod.schema';

export const API_HOST =
    process.env.NEXT_PUBLIC_ORIGIN_API || 'http://localhost:3000';

// tạo các phưng thức fetch data

const createMethods = (
    dfPath: string | URL | Request = '',
    init: RequestInit = {}
) => {
    const method = async (
        path: string = '',
        requestInit: RequestInit = {}
    ): Promise<[undefined, unknown] | [Response, undefined]> => {
        try {
            const res = await fetch(`${dfPath}${path}`, {
                ...init,
                ...requestInit,
            });
            return [res, undefined];
        } catch (error) {
            return [undefined, error];
        }
    };

    method.json = async (
        path: string = '',
        body: object,
        requestInit: RequestInit = init
    ): Promise<[undefined, unknown] | [Response, undefined]> => {
        try {
            const res = await fetch(`${dfPath}${path}`, {
                ...init,
                ...requestInit,
                headers: {
                    ...init.headers,
                    ...requestInit.headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            return [res, undefined];
        } catch (error) {
            return [undefined, error];
        }
    };

    method.formData = async (
        path: string = '',
        body: FormData,
        requestInit: RequestInit = init
    ): Promise<[undefined, unknown] | [Response, undefined]> => {
        try {
            const res = await fetch(`${dfPath}${path}`, {
                ...init,
                ...requestInit,
                headers: {
                    ...init.headers,
                    ...requestInit.headers,
                    'Content-Type': 'multipart/form-data',
                },
                body: body,
            });
            return [res, undefined];
        } catch (error) {
            return [undefined, error];
        }
    };
    return method;
};

class Fetcher {
    get;
    post;
    delete;
    put;
    patch;
    constructor(input: string | URL | Request = '', init: RequestInit = {}) {
        this.get = createMethods(input, { ...init, method: 'GET' });
        this.post = createMethods(input, { ...init, method: 'POST' });
        this.put = createMethods(input, { ...init, method: 'PUT' });
        this.patch = createMethods(input, { ...init, method: 'PATCH' });
        this.delete = createMethods(input, { ...init, method: 'DELETE' });
    }
}

class Http extends Fetcher {
    constructor(input: string | URL | Request = '', init: RequestInit) {
        super(input, init);
    }
}

export const fetcher = new Fetcher(API_HOST);

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
