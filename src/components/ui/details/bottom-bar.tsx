'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Task } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
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
import { deleteTaskAction } from '@/lib/action';
import useStore from '@/store/store';
import { deleteTaskById } from '@/lib/http';

function BottomBar({ task }: { task: Task }) {
    const pathname = usePathname();
    const { push } = useRouter();
    const deleteTask = useStore((state) => state.deleteTask);

    const handleClickOverlay = useCallback(() => {
        push(pathname);
    }, [pathname, push]);

    const action = deleteTaskAction.bind(null, task.id);

    return (
        <div className="h-14 flex items-center px-5 border-t justify-between font-light text-[#333]">
            <button
                className="py-2"
                onClick={handleClickOverlay}
                aria-label="close detail"
            >
                <ArrowRightIcon className="h-[19px]" strokeWidth={1} />
            </button>
            <span className="text-sm">
                Create at {task.createAt.toDateString()}
            </span>
            <AlertDialog>
                <AlertDialogTrigger>
                    <button className="py-2">
                        <TrashIcon
                            className="h-[19px]"
                            strokeWidth={1}
                            aria-label="delete task"
                        />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {`"${task.title}" will be permanently deleted.`}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your task from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                variant="dark"
                                onClick={async () => {
                                    deleteTask(task.id);
                                    await deleteTaskById(task.id);
                                }}
                            >
                                Continue
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default BottomBar;
