import { create, StateCreator } from 'zustand';
import { ListSlice } from './list.store';

export interface AppSlice {
    isOpenNav: boolean;

    handleToggleNav: () => void;
    handleCloseNav: () => void;
    handleOpenNav: () => void;
}

export const createAppSlice: StateCreator<
    AppSlice & ListSlice,
    [],
    [],
    AppSlice
> = (set) => ({
    isOpenNav: false,
    handleToggleNav: () => set((priv) => ({ isOpenNav: !priv.isOpenNav })),
    handleCloseNav: () => set(() => ({ isOpenNav: false })),
    handleOpenNav: () => set(() => ({ isOpenNav: true })),
});
