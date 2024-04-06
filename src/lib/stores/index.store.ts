import { create } from 'zustand';

import { ListSlice, createListSlice } from './list.store';
import { AppSlice, createAppSlice } from './app.store';

const useStore = create<AppSlice & ListSlice>()((...a) => ({
    ...createAppSlice(...a),
    ...createListSlice(...a),
}));

export default useStore;
