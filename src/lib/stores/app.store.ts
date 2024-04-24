import { StateCreator } from 'zustand';
import { ListSlice } from './list.store';
import { CountSlice } from './count.store';

export interface AppSlice {}

export const createAppSlice: StateCreator<
    AppSlice & ListSlice & CountSlice,
    [],
    [],
    AppSlice
> = (set) => ({});
