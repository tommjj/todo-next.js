import { StateCreator } from 'zustand';

import {
    List,
    SubTask,
    SubTaskUpdate,
    Task,
    TaskUpdate,
} from '@/lib/zod.schema';
import { DeleteWithCancel, Sync } from './type.store';
import { AppSlice } from './app.store';
import { arrayMove, setTaskById } from '../utils';
import {
    deleteSubtask,
    deleteTaskById,
    updateSubtaskById,
    updateTaskById,
} from '../http';
import { CountSlice } from './count.store';

export interface ListSlice {
    list: List | null;
    bin: Set<string>;

    setList: (list: List | null) => void;
    handleToggleCompleteTask: (listId: string) => Sync;
    handleToggleImportantTask: (listId: string) => Sync;
    updateTask: (id: string, task: TaskUpdate) => Sync;
    deleteTask: (taskId: string) => DeleteWithCancel;
    moveItem: (fromIndex: number, toIndex: number) => void;
    moveItemById: (
        itemIdMove: string,
        ItemIdMilestones: string,
        dir: 'top' | 'bottom'
    ) => void;
    addTask: (task: Task) => void;
    addSubtask: (subtask: SubTask) => void;
    toggleCompleteSubtask: (taskId: string, subtask: string) => Sync;

    updateSubtask: (subTask: SubTask, data: SubTaskUpdate) => Sync;
    removeSubtask: (subTask: SubTask) => Sync;
}

export const createListSlice: StateCreator<
    AppSlice & ListSlice & CountSlice,
    [],
    [],
    ListSlice
> = (set) => ({
    list: null,
    bin: new Set<string>(),
    setList: (list) => set(() => ({ list: list })),
    updateTask: (id, task) => {
        set((priv) => {
            const list = priv.list;
            const tasks = list?.tasks;

            if (!tasks) return {};
            const [newTasks, newTask] = setTaskById(tasks, id, (state) => ({
                ...({ ...state, ...task } as any),
            }));

            return { list: { ...list, tasks: newTasks } };
        });

        return {
            sync: () => updateTaskById(id, { ...task }),
        };
    },
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
    addSubtask: (subtask) => {
        set((p) => {
            const list = p.list;
            const tasks = list?.tasks;
            if (!tasks) return {};

            let task = tasks.find((i) => i.id === subtask.taskId);
            if (!task) return {};
            if (task?.subTasks) {
                task.subTasks.push(subtask);
                return {
                    list: { ...list, tasks: [...tasks] },
                };
            } else {
                task.subTasks = [subtask];
                return {
                    list: { ...list, tasks: [...tasks] },
                };
            }
        });
    },
    toggleCompleteSubtask: (taskId, subtaskId) => {
        let complete = false;

        set((priv) => {
            const list = priv.list;
            const tasks = list?.tasks;

            if (!tasks) return {};
            let newTasks = tasks.map((task) => {
                if (task.id !== taskId) return task;

                task.subTasks = task.subTasks?.map((subtask) => {
                    if (subtask.id !== subtaskId) return subtask;

                    complete = !subtask.completed;
                    return { ...subtask, completed: complete };
                });

                return { ...task };
            });

            return { list: { ...list, tasks: [...newTasks] } };
        });

        return {
            sync: () => updateSubtaskById(subtaskId, { completed: complete }),
        };
    },

    updateSubtask: (subTask, data) => {
        set((priv) => {
            const list = priv.list;
            const tasks = list?.tasks;

            if (!tasks) return {};
            let newTasks = tasks.map((task) => {
                if (task.id !== subTask.taskId) return task;

                task.subTasks = task.subTasks?.map((subtask) => {
                    if (subtask.id !== subTask.id) return subtask;

                    return { ...subtask, ...data };
                });

                return { ...task };
            });

            return { list: { ...list, tasks: [...newTasks] } };
        });

        return {
            sync: () => updateSubtaskById(subTask.id, { ...data }),
        };
    },

    removeSubtask: (subtask) => {
        set((priv) => {
            const list = priv.list;
            const tasks = list?.tasks;

            if (!tasks) return {};
            let newTasks = tasks.map((task) => {
                if (task.id !== subtask.taskId) return task;

                task.subTasks = task.subTasks?.filter(
                    (item) => item.id !== subtask.id
                );

                return { ...task };
            });

            return { list: { ...list, tasks: [...newTasks] } };
        });

        return {
            sync: () => deleteSubtask(subtask.id),
        };
    },
});

export default createListSlice;
