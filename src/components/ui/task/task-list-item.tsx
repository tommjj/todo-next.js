'use client';

import {
    DragEventHandler,
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

import useStore from '@/lib/stores/index.store';
import {
    useDndDrag,
    useDndMethods,
} from '@/components/ui/drag-a-drop/drag-a-drop';
import { cn } from '@/lib/utils';

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
        <span className="flex justify-center text-[#0D6EFD] mr-[10px]">
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
        <span className="flex justify-center text-[#0D6EFD]">
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
                <div className="animate-remove w-full h-[58px]"></div>
            )}
        </>
    );
};

const TaskItem = ({ task }: { task: Task }) => {
    const { push } = useRouter();
    const moveItemById = useStore((state) => state.moveItemById);
    const listId = useStore((state) => state.list?.id);

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
            push(`/tasks/${listId}?details=${task.id}`);
    }, [push, task.id, listId]);

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
                    'shadow-lg touch-none bg-[#DCEAFF] opacity-70 z-50': isDrag,
                    'before:absolute before:bg-primary-color before:w-full before:h-[1px] before:z-40 z-20 before:left-0':
                        over.isOver,
                    'before:top-[-1px]': over.dir,
                    'before:bottom-[0px]': !over.dir,
                }
            )}
        >
            <CheckBox completed={task.completed} taskId={task.id} />

            <div
                className={cn('text-[#444] dark:text-inherit flex-grow touch')}
            >
                <p className="text-sm">{task.title}</p>
                <p className="text-xs font-light">
                    {task.dueDate?.toDateString()}
                </p>
            </div>
            <Important important={task.important} taskId={task.id} />
        </div>
    );
};
export default TaskItem;
