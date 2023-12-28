'use client';

import useStore from '@/store/store';
import TaskItem from './task-list-item';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Task } from '@prisma/client';

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
                            hidden={!task.completed}
                        />
                    ))}
            </div>
        </>
    );
}

function renderList(lastState: Map<string, number>, tasks: Task[]) {}

function TaskList() {
    const list = useStore((state) => state.list);
    const [lastListMap, setLastListMap] = useState(new Map<string, number>());
    const listMap = useMemo(() => {
        const listMap = new Map<string, number>();
        if (list?.tasks) {
            let count = 0;
            list.tasks.forEach((element) => {
                if (element.completed === false) {
                    listMap.set(element.id, count++);
                }
            });
        }
        return listMap;
    }, [list?.tasks]);

    useEffect(() => {
        const id = setTimeout(() => {
            setLastListMap(listMap);
        }, 100);
        return () => {
            clearTimeout(id);
        };
    }, [listMap]);

    return (
        <div className="w-full flex-grow mt-3 overflow-y-auto">
            {list &&
                list.tasks?.map((task) => {
                    return (
                        <TaskItem
                            key={task.id}
                            task={task}
                            hidden={task.completed}
                        />
                    );
                })}
            <CompletedTskList />
        </div>
    );
}

export default TaskList;
