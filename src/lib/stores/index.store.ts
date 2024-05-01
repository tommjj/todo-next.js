import { create } from 'zustand';

import { CurrentListSlice, createCurrentListSlice } from './current-list.store';
import { AppSlice, createAppSlice } from './app.store';
import { CountSlice, createListsSlice } from './lists.store';

const useStore = create<AppSlice & CurrentListSlice & CountSlice>()((...a) => ({
    ...createAppSlice(...a),
    ...createCurrentListSlice(...a),
    ...createListsSlice(...a),
}));

export default useStore;
