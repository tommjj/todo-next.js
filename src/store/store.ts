import { ListWithTasks } from '@/lib/definitions';
import { create } from 'zustand';

type Data = {
    isOpenNav: boolean;
    list?: ListWithTasks;
};

type Action = {
    setList: (list: ListWithTasks) => void;
    handleToggleNav: () => void;
    handleCloseNav: () => void;
    handleOpenNav: () => void;
};

const useStore = create<Data & Action>()((set) => ({
    isOpenNav: true,
    setList: (list) => set(() => ({ list: list })),
    handleToggleNav: () => set((state) => ({ isOpenNav: !state.isOpenNav })),
    handleCloseNav: () => set((state) => ({ isOpenNav: false })),
    handleOpenNav: () => set((state) => ({ isOpenNav: true })),
}));

export default useStore;
