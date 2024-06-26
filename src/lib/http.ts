import { List, ListSchema, SubTaskUpdate, TaskUpdate } from './zod.schema';

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

export const fetcher = new Fetcher();

export async function getListById(
    id: string
): Promise<[undefined, unknown] | [List, undefined]> {
    try {
        const [res, err] = await fetcher.get(
            `/v1/api/lists/${id}?includeTasks=true`
        );

        if (!res?.ok) throw new Error('not found');

        const dataParse = ListSchema.safeParse(await res.json());

        if (dataParse.success) {
            return [dataParse.data, undefined];
        } else {
            return [undefined, new Error("can't parse")];
        }
    } catch (error) {
        return [undefined, error];
    }
}

export const updateTaskById = async (id: string, task: TaskUpdate) => {
    const [res] = await fetcher.patch.json(`/v1/api/tasks/${id}`, task);
    if (res?.ok) {
        return undefined;
    }
    return new Error('update err');
};

export const updateSubtaskById = async (id: string, data: SubTaskUpdate) => {
    const [res] = await fetcher.patch.json(`/v1/api/subtasks/${id}`, {
        ...data,
    });

    if (res?.ok) {
        return undefined;
    }
    return new Error('update err');
};

export const deleteSubtask = async (id: string) => {
    const [res] = await fetcher.delete(`/v1/api/subtasks/${id}`);

    if (res?.ok) {
        return undefined;
    }
    return new Error('delete err');
};
