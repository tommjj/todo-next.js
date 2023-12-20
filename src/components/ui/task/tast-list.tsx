'use client';

import useStore from '@/store/store';

function TaskList() {
    const list = useStore((state) => state.list);

    return (
        <div className="w-full flex-grow mt-3 overflow-y-auto">
            {list && JSON.stringify(list)}
        </div>
    );
}

export default TaskList;
