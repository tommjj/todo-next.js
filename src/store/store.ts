import { ListWithTasks } from '@/lib/definitions';
import { Task } from '@prisma/client';
import { create } from 'zustand';

type Data = {
    isOpenNav: boolean;
    list: ListWithTasks | null;
};

type Action = {
    setList: (list: ListWithTasks | null) => void;
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
                body: JSON.stringify({ id: listId, completed: complete }),
            })
                .then(() => {})
                .catch(() => {});

            return { list: { ...list, tasks: [...newTasks] } };
        }),
    handleToggleImportantTask: (listId) =>
        set((state) => {
            const list = state.list;
            const task = list?.tasks;
            if (!task) return {};
            const newTask = task.map((item): Task => {
                if (item.id === listId) {
                    return { ...item, important: !item.important };
                }
                return item;
            });

            return { list: { ...list, tasks: [...newTask] } };
        }),
}));

export default useStore;
