'use client';

import useStore from '@/store/store';
import TaskItem from './task-list-item';

function TaskList() {
    const list = useStore((state) => state.list);

    return (
        <div className="w-full flex-grow mt-3 overflow-y-auto">
            {list &&
                list.tasks?.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
        </div>
    );
}

export default TaskList;
