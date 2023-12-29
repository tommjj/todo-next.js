import { List, TaskUpdate, Task } from '@/lib/zod.schema';
import { create } from 'zustand';
import { setTaskById } from '@/lib/utils';
import { updateTaskById } from '@/lib/http';

type Data = {
    isOpenNav: boolean;
    list: List | null;
    bin: Set<string>;
};

type Sync = {
    sync: () => Promise<any>;
};

type DeleteSync = {
    sync: () => Promise<any>;
    cancel: () => void;
};

type Action = {
    setList: (list: List | null) => void;
    handleToggleNav: () => void;
    handleCloseNav: () => void;
    handleOpenNav: () => void;
    handleToggleCompleteTask: (listId: string) => Sync;
    handleToggleImportantTask: (listId: string) => Sync;
    deleteTask: (taskId: string) => void;
};

const useStore = create<Data & Action>()((set) => ({
    isOpenNav: false,
    list: null,
    bin: new Set<string>(),
    setList: (list) => set(() => ({ list: list })),
    handleToggleNav: () => set((priv) => ({ isOpenNav: !priv.isOpenNav })),
    handleCloseNav: () => set(() => ({ isOpenNav: false })),
    handleOpenNav: () => set(() => ({ isOpenNav: true })),
    handleToggleCompleteTask: (listId) => {
        let complete = false;

        set((priv) => {
            const list = priv.list;
            const tasks = list?.tasks;

            if (!tasks) return {};
            const [newTasks, newTask] = setTaskById(tasks, listId, (state) => ({
                ...state,
                completed: !state.completed,
            }));
            complete = newTask?.completed || false;

            return { list: { ...list, tasks: newTasks } };
        });

        return {
            sync: () => updateTaskById(listId, { completed: complete }),
        };
    },
    handleToggleImportantTask: (listId) => {
        let important = false;

        set((priv) => {
            const list = priv.list;
            const tasks = list?.tasks;

            if (!tasks) return {};
            const [newTasks, newTask] = setTaskById(tasks, listId, (state) => ({
                ...state,
                important: !state.important,
            }));
            important = newTask?.important || false;

            return { list: { ...list, tasks: newTasks } };
        });
        return {
            sync: () => updateTaskById(listId, { important: important }),
        };
    },
    deleteTask: (taskId) => {
        set((priv) => ({ bin: new Set(priv.bin).add(taskId) }));
    },
}));

export default useStore;
