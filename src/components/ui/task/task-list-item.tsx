import {
    MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Task } from '@/lib/zod.schema';
import {
    CheckIcon,
    StarIcon as StarIconOutline,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import useStore from '@/store/store';
import { useDndDrag } from '@/components/ui/drag-a-drop/drag-a-drop';
import { cn } from '@/lib/utils';
import { date } from 'zod';

export function CheckBox({
    completed,
    taskId,
}: {
    completed: boolean;
    taskId: string;
}) {
    const handleToggleCompleteTask = useStore(
        (state) => state.handleToggleCompleteTask
    );

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        async (e) => {
            e.stopPropagation();
            await handleToggleCompleteTask(taskId).sync();
        },
        [handleToggleCompleteTask, taskId]
    );

    return (
        <span className="flex justify-center px-2 text-[#0D6EFD]">
            <button
                onClick={handleClick}
                className={`flex justify-center items-center w-4 h-4 border border-[#0D6EFD] rounded-full group ${clsx(
                    { 'bg-[#0D6EFD]': completed }
                )}`}
            >
                <CheckIcon
                    className={`h-2  ${clsx({
                        'hidden md:group-hover:block': !completed,
                        'text-white': completed,
                    })}`}
                    strokeWidth={3}
                />
            </button>
        </span>
    );
}

export function Important({
    important,
    taskId,
}: {
    important: boolean;
    taskId: string;
}) {
    const handleToggleImportantTask = useStore(
        (state) => state.handleToggleImportantTask
    );

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        async (e) => {
            e.stopPropagation();
            await handleToggleImportantTask(taskId).sync();
        },
        [handleToggleImportantTask, taskId]
    );

    return (
        <span className="flex justify-center px-2 text-[#0D6EFD]">
            <button
                onClick={handleClick}
                className={`flex justify-center items-center w-5 h-5 `}
            >
                {important ? (
                    <StarIconSolid />
                ) : (
                    <StarIconOutline strokeWidth={1} />
                )}
            </button>
        </span>
    );
}

const TaskItem = ({
    task,
    hidden = false,
}: {
    task: Task;
    hidden?: boolean;
}) => {
    const { ref, translateY, isDrag } = useDndDrag({
        id: task.id,
        delay: 1000,
    });
    const timeStartClick = useRef(0);
    const [appeared, setAppeared] = useState(false);
    const { push } = useRouter();

    const handleStartClick = useCallback(() => {
        timeStartClick.current = Date.now();
    }, []);
    const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(() => {
        if (timeStartClick.current + 900 > Date.now())
            push(`?details=${task.id}`);
    }, [push, task.id]);

    useEffect(() => {
        if (!hidden) {
            setAppeared(true);
            return;
        }
        const timeOut = setTimeout(() => {
            setAppeared(false);
        }, 150);

        return () => {
            clearTimeout(timeOut);
        };
    }, [hidden]);

    return (
        <>
            {hidden ? (
                appeared ? (
                    <div
                        ref={ref as any}
                        className="transition-all mb-[6px] w-full h-0"
                    ></div>
                ) : null
            ) : (
                <div
                    ref={ref as any}
                    onClick={handleClick}
                    onMouseDown={handleStartClick}
                    onTouchStart={handleStartClick}
                    onDragStart={(e) => {
                        console.log(e);
                    }}
                    onDragOver={(e) => {
                        console.log('over', e.dataTransfer.getData('id'));
                    }}
                    onDragLeave={(e) => {
                        console.log('leave', e.dataTransfer.getData('id'));
                    }}
                    onDragEnter={(e) => {
                        console.log('enter', e.dataTransfer.getData('id'));
                    }}
                    onDragEnd={(e) => {
                        console.log('end', e.dataTransfer.getData('id'));
                    }}
                    style={
                        isDrag
                            ? {
                                  transform: `translateY(${translateY}px)`,
                                  transition: 'none',
                                  touchAction: 'none',
                                  pointerEvents: 'none',
                              }
                            : {}
                    }
                    className={cn(
                        'animate-expand bg-white dark:bg-[#111] flex items-center w-full h-[52px] mb-[6px] px-2 border rounded-md shadow-sm shadow-[#00000040] md:hover:bg-[#DCEAFF] cursor-pointer transition-all',
                        { 'shadow-lg touch-none bg-[#DCEAFF]': isDrag }
                    )}
                >
                    <CheckBox completed={task.completed} taskId={task.id} />

                    <div className={cn('px-2 text-[#444] flex-grow touch')}>
                        <p className="text-sm">{task.title}</p>
                        <p className="text-xs font-light">
                            {task.dueDate?.toDateString()}
                        </p>
                    </div>
                    <Important important={task.important} taskId={task.id} />
                </div>
            )}
        </>
    );
};
export default TaskItem;
