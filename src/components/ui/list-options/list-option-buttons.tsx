'use client';

import { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useStore from '@/lib/stores/index.store';
import { AiOutlineClear } from 'react-icons/ai';
import { TrashIcon } from '@heroicons/react/24/outline';

import Button from '../button';
import { buttonProps } from '../nav/nav-buttons';
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
import { cn } from '@/lib/utils';

export const ClearCurrentListButton = () => {
    const currentListId = useStore((s) => s.currentList?.id);
    const clearCompletedTasksSync = useStore((s) => s.clearCompletedTasksSync);

    const handleClear = useCallback(() => {
        if (!currentListId) return;
        clearCompletedTasksSync(currentListId);
    }, [clearCompletedTasksSync, currentListId]);

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    variant="ghost"
                    className={cn(
                        buttonProps.className,
                        ' px-3 py-1.5 text-amber-600 flex justify-start items-center font-light'
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
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
    );
};

export const DeleteCurrentListButton = () => {
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
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    variant="ghost"
                    className={cn(
                        buttonProps.className,
                        ' px-3 py-1.5 text-red-600 flex justify-start items-center font-light'
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
                        This action cannot be undone. This will permanently
                        delete your list and remove all data of list from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleDelete} variant="destructive">
                            Continue
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
