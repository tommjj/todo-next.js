import { create } from 'zustand';

import { ListSlice, createListSlice } from './list.store';
import { AppSlice, createAppSlice } from './app.store';
import { CountSlice, createCountSlice } from './count.store';

const useStore = create<AppSlice & ListSlice & CountSlice>()((...a) => ({
    ...createAppSlice(...a),
    ...createListSlice(...a),
    ...createCountSlice(...a),
}));

export default useStore;
