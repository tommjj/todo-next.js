import { StateCreator } from 'zustand';
import { ListSlice } from './list.store';
import { AppSlice } from './app.store';

export interface CountSlice {}

export const createCountSlice: StateCreator<
    AppSlice & ListSlice & CountSlice,
    [],
    [],
    CountSlice
> = (set) => ({});
