import { create } from 'zustand';

type Data = {
    isOpenNav: boolean;
};

type Action = {
    handleToggleNav: () => void;
    handleCloseNav: () => void;
    handleOpenNav: () => void;
};

const useStore = create<Data & Action>()((set) => ({
    isOpenNav: true,
    handleToggleNav: () => set((state) => ({ isOpenNav: !state.isOpenNav })),
    handleCloseNav: () => set((state) => ({ isOpenNav: false })),
    handleOpenNav: () => set((state) => ({ isOpenNav: true })),
}));

export default useStore;
