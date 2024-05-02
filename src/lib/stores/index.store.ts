import { create } from 'zustand';

import { CurrentListSlice, createCurrentListSlice } from './current-list.store';
import { AppSlice, createAppSlice } from './app.store';
import { ListsSlice, createListsSlice } from './lists.store';

const useStore = create<AppSlice & CurrentListSlice & ListsSlice>()((...a) => ({
    ...createAppSlice(...a),
    ...createCurrentListSlice(...a),
    ...createListsSlice(...a),
}));

export default useStore;
