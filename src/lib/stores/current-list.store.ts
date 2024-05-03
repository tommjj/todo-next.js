import { StateCreator } from 'zustand';

import { List, ListWithoutTasksType } from '@/lib/zod.schema';
import { AppSlice } from './app.store';
import { ListsSlice } from './lists.store';
import { TasksSlice } from './tasks.store';

export interface CurrentListSlice {
    currentList: ListWithoutTasksType | null;

    setList: (list: List | null) => void;
}

export const createCurrentListSlice: StateCreator<
    AppSlice & CurrentListSlice & ListsSlice & TasksSlice,
    [],
    [],
    CurrentListSlice
> = (set) => ({
    currentList: null,
    setList: (list) =>
        set(() => {
            if (!list) return { currentList: null, tasks: [] };
            const { tasks, ...listWithoutTask } = list;

            return { currentList: listWithoutTask, tasks: tasks || [] };
        }),
});

export default createCurrentListSlice;
