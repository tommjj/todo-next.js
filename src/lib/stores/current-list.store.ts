import { StateCreator } from 'zustand';

import { List, ListWithoutTasksType, Task } from '@/lib/zod.schema';
import { AppSlice } from './app.store';
import { ListsSlice } from './lists.store';
import { TasksSlice } from './tasks.store';
import { getListById } from '../http';

export interface CurrentListSlice {
    currentList: ListWithoutTasksType | null;

    setList: (list: List | { tasks: Task[] } | null) => void;

    refreshCurrentList: () => void;
}

export const createCurrentListSlice: StateCreator<
    AppSlice & CurrentListSlice & ListsSlice & TasksSlice,
    [],
    [],
    CurrentListSlice
> = (set, get) => ({
    currentList: null,
    setList: (list) =>
        set(() => {
            if (!list) return { currentList: null, tasks: [] };
            const { tasks, ...listWithoutTask } = list;

            const temp = listWithoutTask as any;

            return {
                currentList: temp?.id ? temp : null,
                tasks: tasks,
            };
        }),
    refreshCurrentList: async () => {
        const { setList, currentList } = get();

        if (!currentList) return;
        const [data] = await getListById(currentList.id);

        if (data) {
            setList(data);
        }
    },
});

export default createCurrentListSlice;
