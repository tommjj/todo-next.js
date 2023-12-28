import { List, TaskUpdate, Task } from '@/lib/zod.schema';
import { create } from 'zustand';

type Data = {
    isOpenNav: boolean;
    list: List | null;
};

type Action = {
    setList: (list: List | null) => void;
    handleToggleNav: () => void;
    handleCloseNav: () => void;
    handleOpenNav: () => void;
    handleToggleCompleteTask: (listId: string) => void;
    handleToggleImportantTask: (listId: string) => void;
};

const useStore = create<Data & Action>()((set) => ({
    isOpenNav: true,
    list: null,
    setList: (list) => set(() => ({ list: list })),
    handleToggleNav: () => set((state) => ({ isOpenNav: !state.isOpenNav })),
    handleCloseNav: () => set((state) => ({ isOpenNav: false })),
    handleOpenNav: () => set((state) => ({ isOpenNav: true })),
    handleToggleCompleteTask: (listId) =>
        set((state) => {
            const list = state.list;
            const tasks = list?.tasks;
            let complete = false;

            if (!tasks) return {};
            const newTasks = tasks.map((item): Task => {
                if (item.id === listId) {
                    complete = !item.completed;
                    return { ...item, completed: !item.completed };
                }
                return item;
            });

            fetch(`/api/tasks/${listId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    completed: complete,
                } satisfies TaskUpdate),
            })
                .then(() => {})
                .catch(() => {});

            return { list: { ...list, tasks: [...newTasks] } };
        }),
    handleToggleImportantTask: (listId) =>
        set((state) => {
            const list = state.list;
            const task = list?.tasks;
            let important = false;

            if (!task) return {};
            const newTask = task.map((item): Task => {
                if (item.id === listId) {
                    important = !item.important;
                    return { ...item, important: !item.important };
                }
                return item;
            });

            fetch(`/api/tasks/${listId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    important: important,
                } satisfies TaskUpdate),
            })
                .then(() => {})
                .catch(() => {});

            return { list: { ...list, tasks: [...newTask] } };
        }),
}));

export default useStore;
