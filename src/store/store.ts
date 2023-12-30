import { List, TaskUpdate, Task } from '@/lib/zod.schema';
import { create } from 'zustand';
import { setTaskById } from '@/lib/utils';
import { deleteTaskById, updateTaskById } from '@/lib/http';

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
    cancel: () => boolean;
};

type Action = {
    setList: (list: List | null) => void;
    handleToggleNav: () => void;
    handleCloseNav: () => void;
    handleOpenNav: () => void;
    handleToggleCompleteTask: (listId: string) => Sync;
    handleToggleImportantTask: (listId: string) => Sync;
    deleteTask: (taskId: string) => DeleteSync;
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
        var isCancel = false;
        set((priv) => ({ bin: new Set(priv.bin).add(taskId) }));
        return {
            sync: async () => {
                if (isCancel) return;
                try {
                    await deleteTaskById(taskId);

                    set((priv) => {
                        const list = priv.list;
                        const tasks = list?.tasks;
                        const bin = priv.bin;
                        bin.delete(taskId);

                        if (!tasks) return {};
                        const newTasks = tasks.filter(
                            (task) => task.id !== taskId
                        );

                        return {
                            list: { ...list, tasks: newTasks },
                            bin: new Set(bin),
                        };
                    });
                } catch (error) {
                    set((priv) => {
                        const bin = priv.bin;
                        bin.delete(taskId);

                        return {
                            bin: new Set(bin),
                        };
                    });
                }
            },
            cancel: () => {
                isCancel = true;
                set((priv) => {
                    const bin = priv.bin;
                    bin.delete(taskId);

                    return {
                        bin: new Set(bin),
                    };
                });
                return true;
            },
        };
    },
}));

export default useStore;
