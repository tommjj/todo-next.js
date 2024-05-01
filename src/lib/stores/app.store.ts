import { StateCreator } from 'zustand';
import { CurrentListSlice } from './current-list.store';
import { CountSlice } from './lists.store';

export interface AppSlice {}

export const createAppSlice: StateCreator<
    AppSlice & CurrentListSlice & CountSlice,
    [],
    [],
    AppSlice
> = (set) => ({});
