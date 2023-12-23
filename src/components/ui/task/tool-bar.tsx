'use client';

import useStore from '@/store/store';
import {
    Bars3Icon,
    ListBulletIcon,
    ArrowsUpDownIcon,
    EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-nenu';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteListAction } from '@/lib/action';
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

function ToolBarTitle({ list }: { list: { name: string; id: string } }) {
    const isOpenNav = useStore((state) => state.isOpenNav);
    const handleOpenNav = useStore((state) => state.handleOpenNav);
    const deleteAction = deleteListAction.bind(null, list.id);

    return (
        <div className=" flex-grow">
            <div className="h-14 flex items-center pl-4">
                {!isOpenNav ? (
                    <button
                        className="mr-2 text-[#333] dark:text-white"
                        onClick={handleOpenNav}
                        aria-label="open nav"
                    >
                        <Bars3Icon className="h-6" strokeWidth={1} />
                    </button>
                ) : (
                    <ListBulletIcon className="h-6 mr-2" strokeWidth={1} />
                )}
                <span className="font-medium text-xl tracking-tight mr-2">
                    {list.name}
                </span>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button className="flex items-center text-[#333] dark:text-white">
                            <EllipsisHorizontalIcon
                                className="h-6"
                                strokeWidth={1}
                            />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="transition-all duration-75">
                        <DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <button className="w-36 px-3 py-1 text-red-600 flex justify-center items-center">
                                        <TrashIcon className="h-4 mr-2" />
                                        delete list
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete your list
                                            and remove all data of list from our
                                            servers.
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
            </div>
        </div>
    );
}

function ToolBarButton() {
    return (
        <div className="flex pr-5 items-center">
            <button className="flex font-light">
                <ArrowsUpDownIcon className="h-5 mr-1" strokeWidth={1} />
                sort
            </button>
        </div>
    );
}

function ToolBar({ list }: { list: { name: string; id: string } }) {
    return (
        <div className="w-full flex text-[#0D6EFD] dark:text-white">
            <ToolBarTitle list={list} /> <ToolBarButton />
        </div>
    );
}

export default ToolBar;
