'use client';

import { useLoadList } from '@/components/hook';
import AppTitle from '../ui/task/app-title';
import { ListViewCreateTask } from '../ui/task/create-task';
import SortTasksListContainer from '../ui/task/sort-list-container';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/drop-down-menu/drop-down-menu';
import Button from '../ui/button';
import { buttonProps } from '../ui/nav/nav-buttons';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import AlertDialog, {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog/alert-dialog';
import { AiOutlineClear } from 'react-icons/ai';
import useStore from '@/lib/stores/index.store';
import { useCallback } from 'react';

const Header = () => {
    const primaryListId = useStore((s) => s.primary?.id);
    const clearCompletedTasksSync = useStore((s) => s.clearCompletedTasksSync);

    const handleClear = useCallback(() => {
        if (!primaryListId) return;
        clearCompletedTasksSync(primaryListId);
    }, [clearCompletedTasksSync, primaryListId]);

    return (
        <header className="flex items-center justify-end w-full h-14 px-3">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant="ghost"
                        className={cn(buttonProps.className, 'p-1 select-none')}
                    >
                        <EllipsisHorizontalIcon className="h-6 w-6" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="transition-all duration-75 p-1">
                    <DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        buttonProps.className,
                                        ' px-3 py-1 text-amber-600 flex justify-start items-center font-light'
                                    )}
                                >
                                    <AiOutlineClear className="h-5 w-4 mr-2" />
                                    Clear tasks
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Clear all completed task?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            className="bg-amber-600"
                                            onClick={handleClear}
                                            variant="warning"
                                        >
                                            Continue
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};

export const TodoPage = () => {
    const { isLoading } = useLoadList('todo');

    return isLoading ? null : (
        <>
            <Header />
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <AppTitle name="todo" />
                    <div className="flex flex-col w-full flex-grow">
                        <div className="">
                            <ListViewCreateTask />
                        </div>

                        <SortTasksListContainer />
                    </div>
                </div>
            </div>
        </>
    );
};
