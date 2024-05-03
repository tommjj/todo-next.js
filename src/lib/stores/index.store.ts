import { create } from 'zustand';

import { CurrentListSlice, createCurrentListSlice } from './current-list.store';
import { AppSlice, createAppSlice } from './app.store';
import { ListsSlice, createListsSlice } from './lists.store';
import { createTasksAppSlice, TasksSlice } from './tasks.store';

const useStore = create<
    AppSlice & CurrentListSlice & ListsSlice & TasksSlice
>()((...a) => ({
    ...createAppSlice(...a),
    ...createCurrentListSlice(...a),
    ...createListsSlice(...a),
    ...createTasksAppSlice(...a),
}));

export default useStore;
