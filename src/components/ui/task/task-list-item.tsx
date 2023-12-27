import { Task } from '@prisma/client';
import {
    CheckIcon,
    StarIcon as StarIconOutline,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import useStore from '@/store/store';
import { MouseEventHandler, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
        (e) => {
            e.stopPropagation();
            handleToggleCompleteTask(taskId);
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
        (e) => {
            e.stopPropagation();
            handleToggleImportantTask(taskId);
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

function TaskItem({ task, hidden = false }: { task: Task; hidden?: boolean }) {
    const { push } = useRouter();

    const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(() => {
        push(`?details=${task.id}`);
    }, [push, task.id]);

    return (
        <>
            {hidden ? (
                <div className="transition-all mb-[6px] w-full h-0"></div>
            ) : (
                <div
                    onClick={handleClick}
                    draggable
                    className="animate-expand flex items-center w-full h-[52px] mb-[6px] px-2 border rounded-md shadow-sm shadow-[#00000040] hover:bg-[#0D6EFD15] cursor-pointer transition-all"
                >
                    <CheckBox completed={task.completed} taskId={task.id} />

                    <div className="px-2 text-[#444] flex-grow">
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
}
export default TaskItem;
