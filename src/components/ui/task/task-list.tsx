'use client';

import useStore from '@/lib/stores/index.store';
import TaskItem, { RemoveAnimation } from './task-list-item';
import { useCallback, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { DNDProvider, DnDContainer } from '../drag-a-drop/drag-a-drop';

function CompletedTskList() {
    const tasks = useStore((state) => state.list?.tasks);
    const bin = useStore((state) => state.bin);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = useCallback(() => {
        setIsOpen((privState) => !privState);
    }, []);

    if (!tasks) return <></>;

    const count = tasks.reduce((count, item) => {
        if (item.completed && !bin.has(item.id)) return ++count;
        return count;
    }, 0);

    return (
        <>
            <div
                className="w-full h-[52px] mb-1 px-2 flex items-center border-b text-[#333] dark:text-white cursor-pointer"
                onClick={handleClick}
            >
                <samp className="pr-2">
                    <ChevronRightIcon
                        className={`h-4 transition-transform ${clsx({
                            'rotate-90': isOpen,
                        })}`}
                    />
                </samp>
                <div className="select-none text-sm">
                    <span className="mr-2">completed</span>
                    <span className="font-light">{count}</span>
                </div>
            </div>
            <div>
                {isOpen &&
                    tasks.map((task) => (
                        <RemoveAnimation key={`todo::${task.id}`}>
                            {!task.completed || bin.has(task.id) ? null : (
                                <TaskItem task={task} />
                            )}
                        </RemoveAnimation>
                    ))}
            </div>
        </>
    );
}

const TodoList = () => {
    const list = useStore((state) => state.list);
    const bin = useStore((state) => state.bin);

    return (
        <>
            {list &&
                list.tasks?.map((task) => (
                    <RemoveAnimation key={`todo::${task.id}`}>
                        {task.completed || bin.has(task.id) ? null : (
                            <TaskItem task={task} />
                        )}
                    </RemoveAnimation>
                ))}
        </>
    );
};

function TaskList() {
    return (
        <div className="w-full flex-grow relative">
            <DNDProvider>
                <DnDContainer>
                    <TodoList />
                    <CompletedTskList />
                </DnDContainer>
            </DNDProvider>
        </div>
    );
}

export default TaskList;
