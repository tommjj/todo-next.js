'use client';

import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';
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
import Button from '../button';
import { buttonProps } from '../nav/nav-buttons';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useStore from '@/lib/stores/index.store';

export const AppHeader = () => {
    const currentListId = useStore((s) => s.currentList?.id);
    const { board } = useParams();

    const { push } = useRouter();
    const removeList = useStore((s) => s.removeList);

    const handleDelete = useCallback(() => {
        if (!currentListId) return;
        const { sync, nextId, privId } = removeList(currentListId);
        if (board === currentListId) {
            push(`/tasks/${privId || nextId || 'todo'}`);
        }
        sync();
    }, [board, currentListId, push, removeList]);

    return (
        <header className="flex items-center justify-between w-full h-14 px-3">
            <div></div>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant="ghost"
                        className={cn(buttonProps.className, 'p-1 select-none')}
                    >
                        <EllipsisHorizontalIcon className="h-6 w-6" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="transition-all duration-75">
                    <DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        buttonProps.className,
                                        ' w-36 px-3 py-1 text-red-600 flex justify-start items-center font-light'
                                    )}
                                >
                                    <TrashIcon className="h-4 mr-2" />
                                    Delete list
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your list and remove
                                        all data of list from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            onClick={handleDelete}
                                            variant="destructive"
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