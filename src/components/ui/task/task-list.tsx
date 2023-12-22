'use client';

import useStore from '@/store/store';
import TaskItem from './task-list-item';
import { useCallback, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

function CompletedTskList() {
    const tasks = useStore((state) => state.list?.tasks);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = useCallback(() => {
        setIsOpen((privState) => !privState);
    }, []);

    if (!tasks) return <></>;

    const count = tasks.reduce((count, item) => {
        if (item.completed) return ++count;
        return count;
    }, 0);

    return (
        <>
            <div
                className="w-full h-[52px] mb-1 px-2 flex items-center border-b text-[#333] dark:text-white cursor-pointer"
                onClick={handleClick}
            >
                <samp className="px-2">
                    <ChevronRightIcon
                        className={`h-4 transition-transform ${clsx({
                            'rotate-90': isOpen,
                        })}`}
                    />
                </samp>
                <div>
                    <span className="mr-2">completed</span>
                    <span>{count}</span>
                </div>
            </div>
            <div>
                {isOpen &&
                    tasks.map(
                        (task) =>
                            task.completed && (
                                <TaskItem key={task.id} task={task} />
                            )
                    )}
            </div>
        </>
    );
}

function TaskList() {
    const list = useStore((state) => state.list);

    return (
        <div className="w-full flex-grow mt-3 overflow-y-auto">
            {list &&
                list.tasks?.map((task) =>
                    task.completed ? null : (
                        <TaskItem key={task.id} task={task} />
                    )
                )}
            <CompletedTskList />
        </div>
    );
}

export default TaskList;
