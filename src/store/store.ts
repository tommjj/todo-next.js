import { List, TaskUpdate, Task } from '@/lib/zod.schema';
import { create } from 'zustand';
import { arrayMove, setTaskById } from '@/lib/utils';
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
    moveItem: (fromIndex: number, toIndex: number) => void;
    moveItemById: (
        itemIdMove: string,
        ItemIdMilestones: string,
        dir: 'top' | 'bottom'
    ) => void;
    addTask: (task: Task) => void;
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
    moveItem: (fromIndex, toIndex) => {
        set((priv) => {
            const list = priv.list;
            const tasks = list?.tasks;
            if (!tasks) return {};

            const newList = [...tasks];

            arrayMove(newList, fromIndex, toIndex);
            return {
                list: { ...list, tasks: [...newList] },
            };
        });
    },
    moveItemById: (itemIdMove, itemIdMilestones, dir) => {
        set((priv) => {
            const list = priv.list;
            const tasks = list?.tasks;
            if (!tasks) return {};

            const fromIndex = tasks.findIndex((e) => e.id === itemIdMove);
            const toIndex = tasks.findIndex((e) => e.id === itemIdMilestones);

            if (fromIndex === -1 || toIndex === -1) return {};

            const setIndex = () => {
                return dir === 'bottom'
                    ? fromIndex < toIndex
                        ? toIndex
                        : toIndex + 1
                    : fromIndex > toIndex
                    ? toIndex
                    : toIndex - 1;
            };

            const newList = [...tasks];

            arrayMove(newList, fromIndex, setIndex());
            return {
                list: { ...list, tasks: [...newList] },
            };
        });
    },
    addTask: (task) =>
        set((p) => {
            const list = p.list;
            const tasks = list?.tasks;
            if (!tasks) return {};

            return {
                list: { ...list, tasks: [task, ...tasks] },
            };
        }),
}));

export default useStore;
