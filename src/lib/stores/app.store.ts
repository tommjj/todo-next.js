import { StateCreator } from 'zustand';
import { ListSlice } from './list.store';

export interface AppSlice {}

export const createAppSlice: StateCreator<
    AppSlice & ListSlice,
    [],
    [],
    AppSlice
> = (set) => ({});
