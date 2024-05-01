import { StateCreator } from 'zustand';
import { CurrentListSlice } from './current-list.store';
import { AppSlice } from './app.store';

export interface CountSlice {}

export const createListsSlice: StateCreator<
    AppSlice & CurrentListSlice & CountSlice,
    [],
    [],
    CountSlice
> = (set) => ({});
