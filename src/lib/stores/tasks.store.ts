import { StateCreator } from 'zustand';
import { CurrentListSlice } from './current-list.store';
import { ListsSlice } from './lists.store';
import { AppSlice } from './app.store';
import { Task, List, SubTask, SubTaskUpdate, TaskUpdate } from '../zod.schema';

import {
    deleteSubtask,
    fetcher,
    updateSubtaskById,
    updateTaskById,
} from '../http';
import { DeleteWithCancel, Sync } from './type.store';
import { arrayMove, setTaskById } from '../utils';

export interface TasksSlice {
    tasks: Task[];
    bin: Set<string>;

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

export const createTasksAppSlice: StateCreator<
    AppSlice & CurrentListSlice & ListsSlice & TasksSlice,
    [],
    [],
    TasksSlice
> = (set) => ({
    tasks: [],
    bin: new Set<string>(),

    updateTask: (id, task) => {
        set((priv) => {
            const tasks = priv.tasks;

            const [newTasks, newTask] = setTaskById(tasks, id, (state) => ({
                ...({ ...state, ...task } as any),
            }));

            return { tasks: newTasks };
        });

        return {
            sync: () => updateTaskById(id, { ...task }),
        };
    },
    handleToggleCompleteTask: (taskId) => {
        let complete = false;

        set((priv) => {
            const tasks = priv.tasks;

            const [newTasks, newTask] = setTaskById(tasks, taskId, (state) => ({
                ...state,
                completed: !state.completed,
            }));
            complete = newTask?.completed || false;

            return { tasks: newTasks };
        });

        return {
            sync: () => updateTaskById(taskId, { completed: complete }),
        };
    },
    handleToggleImportantTask: (taskId) => {
        let important = false;

        set((priv) => {
            const tasks = priv.tasks;

            const [newTasks, newTask] = setTaskById(tasks, taskId, (state) => ({
                ...state,
                important: !state.important,
            }));
            important = newTask?.important || false;

            return { tasks: newTasks };
        });
        return {
            sync: () => updateTaskById(taskId, { important: important }),
        };
    },
    deleteTask: (taskId) => {
        var isCancel = false;
        set((priv) => ({ bin: new Set(priv.bin).add(taskId) }));
        return {
            sync: async () => {
                if (isCancel) return;
                try {
                    await fetcher.delete(`/api/tasks/${taskId}`);

                    set((priv) => {
                        const tasks = priv.tasks;

                        const bin = priv.bin;
                        bin.delete(taskId);

                        if (!tasks) return {};
                        const newTasks = tasks.filter(
                            (task) => task.id !== taskId
                        );

                        return {
                            tasks: newTasks,
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
            const tasks = priv.tasks;
            const newList = [...tasks];

            arrayMove(newList, fromIndex, toIndex);
            return {
                tasks: newList,
            };
        });
    },
    moveItemById: (itemIdMove, itemIdMilestones, dir) => {
        set((priv) => {
            const tasks = priv.tasks;
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
                tasks: newList,
            };
        });
    },
    addTask: (task) =>
        set((priv) => {
            const tasks = priv.tasks;

            return {
                tasks: [task, ...tasks],
            };
        }),
    addSubtask: (subtask) => {
        set((priv) => {
            const tasks = priv.tasks;

            let task = tasks.find((i) => i.id === subtask.taskId);
            if (!task) return {};
            if (task?.subTasks) {
                task.subTasks.push(subtask);
                return {
                    tasks: [...tasks],
                };
            } else {
                task.subTasks = [subtask];
                return {
                    tasks: [...tasks],
                };
            }
        });
    },
    toggleCompleteSubtask: (taskId, subtaskId) => {
        let complete = false;

        set((priv) => {
            const tasks = priv.tasks;

            let newTasks = tasks.map((task) => {
                if (task.id !== taskId) return task;

                task.subTasks = task.subTasks?.map((subtask) => {
                    if (subtask.id !== subtaskId) return subtask;

                    complete = !subtask.completed;
                    return { ...subtask, completed: complete };
                });

                return { ...task };
            });

            return { tasks: [...newTasks] };
        });

        return {
            sync: () => updateSubtaskById(subtaskId, { completed: complete }),
        };
    },

    updateSubtask: (subTask, data) => {
        set((priv) => {
            const tasks = priv.tasks;

            let newTasks = tasks.map((task) => {
                if (task.id !== subTask.taskId) return task;

                task.subTasks = task.subTasks?.map((subtask) => {
                    if (subtask.id !== subTask.id) return subtask;

                    return { ...subtask, ...data };
                });

                return { ...task };
            });

            return { tasks: [...newTasks] };
        });

        return {
            sync: () => updateSubtaskById(subTask.id, { ...data }),
        };
    },

    removeSubtask: (subtask) => {
        set((priv) => {
            const tasks = priv.tasks;

            if (!tasks) return {};
            let newTasks = tasks.map((task) => {
                if (task.id !== subtask.taskId) return task;

                task.subTasks = task.subTasks?.filter(
                    (item) => item.id !== subtask.id
                );

                return { ...task };
            });

            return { tasks: [...newTasks] };
        });

        return {
            sync: () => deleteSubtask(subtask.id),
        };
    },
});
