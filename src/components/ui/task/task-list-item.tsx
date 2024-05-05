'use client';

import {
    DragEventHandler,
    MouseEventHandler,
    useCallback,
    useEffect,
    useMemo,
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
import { GoWorkflow } from 'react-icons/go';
import clsx from 'clsx';

import useStore from '@/lib/stores/index.store';
import {
    useDndDrag,
    useDndMethods,
} from '@/components/ui/drag-a-drop/drag-a-drop';
import { cn } from '@/lib/utils';
import { DateTitle } from '../date';

const Color = {
    BgColor: {
        primary: ' ',
        red: 'bg-red-400 bg-opacity-[0.15]',
        amber: 'bg-amber-400 bg-opacity-[0.15]',
        blue: 'bg-blue-400 bg-opacity-[0.15]',
    },
    CompletedBgColor: {
        primary: 'bg-primary-color dark:bg-primary-color-dark',
        red: 'bg-red-400',
        amber: 'bg-amber-400',
        blue: 'bg-blue-400',
    },
    TextColor: {
        primary: 'text-primary-color dark:text-primary-color-dark',
        red: 'text-red-400',
        amber: 'text-amber-400',
        blue: 'text-blue-400',
    },
    BorderColor: {
        primary: 'border-primary-color dark:border-primary-color-dark',
        red: 'border-red-400',
        amber: 'border-amber-400',
        blue: 'border-blue-400',
    },
};

export function TaskCheckBox({
    completed,
    taskId,
    color = 'primary',
}: {
    completed: boolean;
    taskId: string;
    color?: 'primary' | 'red' | 'amber' | 'blue';
}) {
    const repeatTask = useStore((s) => s.repeatTask);
    const handleToggleCompleteTask = useStore(
        (s) => s.handleToggleCompleteTask
    );

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        async (e) => {
            e.stopPropagation();

            const { completed, sync } = handleToggleCompleteTask(taskId);
            sync();
            if (completed !== undefined && completed) repeatTask(taskId);
        },
        [handleToggleCompleteTask, repeatTask, taskId]
    );

    return (
        <span
            className={`flex justify-center text-primary-color dark:text-primary-color-dark mr-[10px] ${Color.TextColor[color]}`}
        >
            <button
                onClick={handleClick}
                className={`flex justify-center items-center w-[1.1rem] h-[1.1rem] border  rounded-full group ${clsx(
                    {
                        [Color.BorderColor[color]]: true,
                        [Color.CompletedBgColor[color]]: completed,
                        [Color.BgColor[color]]: !completed,
                    }
                )}`}
            >
                <CheckIcon
                    className={`h-2.5  ${clsx({
                        'hidden md:group-hover:block': !completed,
                        'text-main-bg-color dark:text-main-bg-color-dark':
                            completed,
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
        <span className="flex justify-center text-primary-color dark:text-primary-color-dark">
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

export const RemoveAnimation = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isNull, setIsNull] = useState(true);

    useEffect(() => {
        if (children) {
            setIsNull(false);
            return;
        }
        const id = setTimeout(() => {
            setIsNull(true);
        }, 1000);

        return () => {
            clearTimeout(id);
        };
    }, [children]);

    return (
        <>
            {isNull ? null : children ? (
                <>{children}</>
            ) : (
                <div className="animate-remove w-full h-[52px]"></div>
            )}
        </>
    );
};

const TaskItem = ({ task }: { task: Task }) => {
    const { push } = useRouter();
    const moveItemById = useStore((state) => state.moveItemById);
    const listId = useStore((state) => state.currentList?.id);

    const { ref, translateY, isDrag } = useDndDrag({
        id: task.id,
        delay: 500,
    });
    const { getDraggingItem } = useDndMethods();

    const timeStartClick = useRef(0);
    const [over, setOver] = useState({ dir: true, isOver: false });

    const handleStartClick = useCallback(() => {
        timeStartClick.current = Date.now();
    }, []);

    const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(() => {
        if (timeStartClick.current + 200 > Date.now())
            push(`?details=${task.id}`, {
                shallow: true,
            });
    }, [push, task.id]);

    const handleOver: DragEventHandler = useCallback(
        (e) => {
            const draggingRect = getDraggingItem()?.getBoundingClientRect();
            const rect = ref.current?.getBoundingClientRect();
            if (draggingRect && rect)
                setOver({ dir: draggingRect.y < rect.y, isOver: true });
        },
        [getDraggingItem, ref]
    );
    const handleEnd: DragEventHandler = useCallback(
        (e) => {
            const draggingRect = getDraggingItem()?.getBoundingClientRect();
            const rect = ref.current?.getBoundingClientRect();
            if (draggingRect && rect) {
                moveItemById(
                    e.dataTransfer.getData('id'),
                    task.id,
                    draggingRect.y < rect.y ? 'top' : 'bottom'
                );
            }
            setOver({ dir: false, isOver: false });
        },
        [getDraggingItem, moveItemById, ref, task.id]
    );
    const handleEnter: DragEventHandler = useCallback(
        (e) => {
            const draggingRect = getDraggingItem()?.getBoundingClientRect();
            const rect = ref.current?.getBoundingClientRect();
            if (draggingRect && rect)
                setOver({ dir: draggingRect.y < rect.y, isOver: true });
        },
        [getDraggingItem, ref]
    );
    const handleLeave: DragEventHandler = useCallback((e) => {
        setOver({ dir: false, isOver: false });
    }, []);

    const subTaskCompletedCount = useMemo(() => {
        return task.subTasks.reduce((pri, cur) => {
            return cur.completed ? pri + 1 : pri;
        }, 0);
    }, [task.subTasks]);

    return (
        <div
            ref={ref as any}
            onClick={handleClick}
            onMouseDown={handleStartClick}
            onTouchStart={handleStartClick}
            onDragOver={handleOver}
            onDragLeave={handleLeave}
            onDragEnter={handleEnter}
            onDragEnd={handleEnd}
            style={
                isDrag
                    ? {
                          transform: `translateY(${translateY}px)`,
                          transition: 'none',
                      }
                    : {}
            }
            className={cn(
                'animate-expand relative bg-inherit flex items-center w-full h-[52px] border-b cursor-pointer',
                {
                    'shadow-lg touch-none bg-white opacity-80 z-50 px-2 rounded-b':
                        isDrag,
                    'before:absolute before:bg-primary-color before:w-full before:h-[1px] before:z-40 z-20 before:left-0':
                        over.isOver,
                    'before:top-[-1px]': over.dir,
                    'before:bottom-[0px]': !over.dir,
                }
            )}
        >
            <TaskCheckBox
                completed={task.completed}
                color={
                    (task.priority === 'PRIORITY4' && 'primary') ||
                    (task.priority === 'PRIORITY3' && 'blue') ||
                    (task.priority === 'PRIORITY2' && 'amber') ||
                    (task.priority === 'PRIORITY1' && 'red') ||
                    'primary'
                }
                taskId={task.id}
            />

            <div
                className={cn('text-[#444] dark:text-inherit flex-grow touch')}
            >
                <p
                    className={cn('text-sm', {
                        'line-through': task.completed,
                    })}
                >
                    {task.title}
                </p>
                <div className="flex gap-2.5 mt-0.5">
                    {task.subTasks.length > 0 && (
                        <span className="flex items-center text-xs font-light">
                            <GoWorkflow className="mr-1 w-[0.6rem] h-[0.6rem]" />
                            {`${subTaskCompletedCount}/${task.subTasks.length}`}
                        </span>
                    )}
                    <span className="text-xs font-light">
                        {task.dueDate && (
                            <DateTitle
                                className="flex items-center "
                                date={task.dueDate}
                                withIcon={true}
                                iconClassName="mr-1 w-[0.58rem] h-[0.58rem]"
                            />
                        )}
                    </span>
                </div>
            </div>
            <Important important={task.important} taskId={task.id} />
        </div>
    );
};
export default TaskItem;
