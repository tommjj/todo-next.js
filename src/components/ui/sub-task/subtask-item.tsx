import useStore from '@/lib/stores/index.store';
import { cn } from '@/lib/utils';
import { SubTask } from '@/lib/zod.schema';
import {
    CheckIcon,
    EllipsisHorizontalIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import Button from '../button';
import { buttonProps } from '../nav/nav-buttons';
import { FaRegEdit } from 'react-icons/fa';

export const SubTaskCheckBox = ({ subtask }: { subtask: SubTask }) => {
    const toggleCompleteSubtask = useStore((s) => s.toggleCompleteSubtask);

    const handleClick = useCallback(() => {
        const { sync } = toggleCompleteSubtask(subtask.taskId, subtask.id);
        sync();
    }, [subtask.id, subtask.taskId, toggleCompleteSubtask]);

    return (
        <button
            onClick={handleClick}
            className={`flex justify-center items-center w-4 h-4 border border-primary-color dark:border-primary-color-dark rounded-full group/checkbox ${cn(
                {
                    'bg-primary-color dark:bg-primary-color-dark':
                        subtask.completed,
                }
            )}`}
        >
            <CheckIcon
                className={`h-2  ${cn({
                    'hidden md:group-hover/checkbox:block': !subtask.completed,
                    'text-white dark:text-main-bg-color-dark':
                        subtask.completed,
                })}`}
                strokeWidth={3}
            />
        </button>
    );
};

export const SubtaskItem = ({
    subtask,
    setEditor,
}: {
    subtask: SubTask;
    setEditor: () => void;
}) => {
    const removeSubtask = useStore((s) => s.removeSubtask);

    const handleClick = useCallback(() => {
        const { sync } = removeSubtask(subtask);
        sync();
    }, [subtask, removeSubtask]);

    return (
        <div className="group flex w-full py-2">
            <div
                className={cn('flex justify-center items-start px-2 pt-[3px]', {
                    'pt-1': subtask.description,
                })}
            >
                <SubTaskCheckBox subtask={subtask} />
            </div>
            <div className="flex-grow">
                <div
                    className={cn('text-[0.9rem] text-[#444444]', {
                        'line-through': subtask.completed,
                    })}
                >
                    {subtask.title}
                </div>
                <div className="text-[0.8rem] font-light opacity-80">
                    {subtask.description}
                </div>
            </div>
            <div className="pr-1">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            className={cn(
                                buttonProps.className,
                                'p-[1px] select-none opacity-0 group-hover:opacity-50'
                            )}
                        >
                            <EllipsisHorizontalIcon className="h-[20px] w-[20px] " />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="transition-all duration-75 p-1">
                        <Button
                            onClick={setEditor}
                            variant="ghost"
                            className={cn(
                                buttonProps.className,
                                ' w-36 px-3 py-1 flex justify-start items-center font-light mb-1'
                            )}
                        >
                            <FaRegEdit className="h-4 mr-2 opacity-90 mb-[1px]" />
                            Edit
                        </Button>
                        <DropdownMenuItem>
                            <Button
                                onClick={handleClick}
                                variant="ghost"
                                className={cn(
                                    buttonProps.className,
                                    ' w-36 px-3 py-1 text-red-600 flex justify-start items-center font-light'
                                )}
                            >
                                <TrashIcon className="h-4 mr-2" />
                                Delete
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
