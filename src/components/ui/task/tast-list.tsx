'use client';

import useStore from '@/store/store';

function TaskList() {
    const list = useStore((state) => state.list);

    return <div>{list && JSON.stringify(list)}</div>;
}

export default TaskList;
