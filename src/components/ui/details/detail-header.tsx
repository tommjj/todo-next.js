import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import AlertDialog, {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../alert-dialog/alert-dialog';
import { BsLayoutSidebarReverse } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import Button from '../button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { buttonProps } from '../nav/nav-buttons';
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';
import useStore from '@/lib/stores/index.store';
import { Task } from '@/lib/zod.schema';
import { toast } from '../sonner/sonner';

export const DetailHeader = ({ task }: { task?: Task | null }) => {
    const searchParam = useSearchParams();
    const { push } = useRouter();
    const deleteTask = useStore((state) => state.removeTask);

    const handleClose = useCallback(() => {
        const param = new URLSearchParams(searchParam);
        param.delete('details');
        push(`?${param.toString()}`);
    }, [push, searchParam]);

    return (
        <header className="flex items-center justify-center w-full h-14">
            <div className="flex justify-between w-full m-[0.63rem]">
                <div
                    className={cn('bg-nav-bg-color dark:bg-nav-bg-color-dark')}
                >
                    <Button
                        onClick={handleClose}
                        className="group p-[8px] "
                        variant="ghost"
                        aria-controls="toggle nav"
                    >
                        <BsLayoutSidebarReverse className="w-[17px] h-[17px] text-[#666] group-hover:text-[#333] dark:text-nav-text-color-dark group-hover:dark:text-nav-text-color-dark" />
                    </Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            className={cn(
                                buttonProps.className,
                                'p-1 select-none'
                            )}
                        >
                            <EllipsisHorizontalIcon className="h-6 w-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="transition-all duration-75">
                        <DropdownMenuItem>
                            <Button
                                onClick={() => {
                                    if (!task) return;

                                    const { sync, cancel } = deleteTask(
                                        task.id
                                    );

                                    toast({
                                        title: 'deleted',
                                        description: `deleted ${task.title}`,
                                        callBack: async () => {
                                            await sync();
                                        },
                                        action: {
                                            label: 'cancel',
                                            onClick: () => {
                                                cancel();
                                            },
                                        },
                                    });

                                    setTimeout(handleClose);
                                }}
                                variant="ghost"
                                className={cn(
                                    buttonProps.className,
                                    'w-36 px-3 py-1 text-red-600 flex justify-start items-center font-light'
                                )}
                            >
                                <TrashIcon className="h-4 mr-2 " />
                                Delete
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
