import { StateCreator } from 'zustand';
import { CurrentListSlice } from './current-list.store';
import { ListsSlice } from './lists.store';

export interface AppSlice {}

export const createAppSlice: StateCreator<
    AppSlice & CurrentListSlice & ListsSlice,
    [],
    [],
    AppSlice
> = (set) => ({});
