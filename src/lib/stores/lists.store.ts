import { StateCreator } from 'zustand';
import { CurrentListSlice } from './current-list.store';
import { AppSlice } from './app.store';
import {
    ListCreateType,
    ListUpdateType,
    ListWithoutTasksType,
} from '@/lib/zod.schema';
import { fetcher } from '../http';
import { Sync } from './type.store';
import { TasksSlice } from './tasks.store';

export interface ListsSlice {
    primary?: ListWithoutTasksType;
    lists: ListWithoutTasksType[];
    shareLists: ListWithoutTasksType[];
    fetchLists: () => void;
    addListSync: (
        data: ListCreateType
    ) => Promise<ListWithoutTasksType | undefined>;
    updateListById: (id: string, data: ListUpdateType) => Sync;
    removeList: (id: string) => Sync & { nextId?: string; privId?: string };
}

export const createListsSlice: StateCreator<
    AppSlice & CurrentListSlice & ListsSlice & TasksSlice,
    [],
    [],
    ListsSlice
> = (set) => ({
    primary: undefined,
    lists: [],
    shareLists: [],
    fetchLists: async () => {
        const [res] = await fetcher.get('/v1/api/lists');
        if (res?.ok) {
            const data = (await res.json()).data as {
                primary: ListWithoutTasksType;
                lists: ListWithoutTasksType[];
                shareLists: ListWithoutTasksType[];
            };

            set({ ...data });
        }
    },
    addListSync: async (data) => {
        const [res] = await fetcher.post.json('/v1/api/lists', data);

        if (res?.ok) {
            const data = (await res.json()).data as ListWithoutTasksType;

            set((priv) => ({ lists: [...priv.lists, data] }));
            return data;
        }
        return undefined;
    },
    updateListById: (id, data) => {
        set((priv) => ({
            lists: priv.lists.map((i) => (i.id !== id ? i : { ...i, ...data })),
        }));
        return {
            sync: async () => {
                await fetcher.patch.json(`/v1/api/lists/${id}`, data);
            },
        };
    },
    removeList: (id) => {
        let nextId: string | undefined, privId: string | undefined;
        set((priv) => {
            const index = priv.lists.findIndex((i) => i.id === id);
            privId = priv.lists[index - 1]?.id;
            nextId = priv.lists[index + 1]?.id;

            return {
                lists: priv.lists.filter((i) => {
                    return i.id !== id;
                }),
            };
        });

        return {
            nextId,
            privId,
            sync: async () => {
                const [res] = await fetcher.delete(`/v1/api/lists/${id}`);
            },
        };
    },
});
