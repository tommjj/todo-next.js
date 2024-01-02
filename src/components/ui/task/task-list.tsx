'use client';

import useStore from '@/store/store';
import TaskItem from './task-list-item';
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
                <samp className="px-2">
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
                        <TaskItem
                            key={task.id}
                            task={task}
                            hidden={!task.completed || bin.has(task.id)}
                        />
                    ))}
            </div>
        </>
    );
}

function TaskList() {
    const list = useStore((state) => state.list);
    const bin = useStore((state) => state.bin);

    return (
        <div className="w-full flex-grow mt-3 overflow-y-auto">
            <DNDProvider>
                <DnDContainer>
                    {list &&
                        list.tasks?.map((task) => {
                            return (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    hidden={task.completed || bin.has(task.id)}
                                />
                            );
                        })}
                    <CompletedTskList />
                </DnDContainer>
            </DNDProvider>
        </div>
    );
}

export default TaskList;
