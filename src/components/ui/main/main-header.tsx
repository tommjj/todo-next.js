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
import { deleteListAction } from '@/lib/action';
import { buttonProps } from '../nav/nav-buttons';
import { cn } from '@/lib/utils';

export const MainHeader = ({
    list,
}: {
    list: { id: string; name: string };
}) => {
    const deleteAction = deleteListAction.bind(null, list.id);

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
                                        <form action={deleteAction}>
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                            >
                                                Continue
                                            </Button>
                                        </form>
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
