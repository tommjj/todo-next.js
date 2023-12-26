'use client';

import { Lists } from '@/lib/definitions';
import useStore from '@/store/store';
import {
    Bars3Icon,
    ListBulletIcon,
    EllipsisVerticalIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import CreateListForm from '../create-list/create-list-form';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
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

function Nav({ lists }: { lists: Lists }) {
    const isOpen = useStore((state) => state.isOpenNav);
    const handleToggleNav = useStore((state) => state.handleToggleNav);
    const handleClose = useStore((state) => state.handleCloseNav);

    useLayoutEffect(() => {
        if (window.innerWidth < 768) {
            handleClose();
        }
    }, [handleClose]);

    return (
        <nav
            className={`flex w-full h-full absolute top-0 left-0 md:w-[240px] md:relative lg:w-[290px] border-r z-50 ${clsx(
                { hidden: !isOpen }
            )}`}
        >
            <div className="w-[290px] md:w-ful inset-0 bg-white dark:bg-[#111]">
                <div className="h-14 flex items-center justify-between px-4 ">
                    <button
                        onClick={handleToggleNav}
                        aria-label="toggle side nav"
                    >
                        <Bars3Icon
                            className="h-6 cursor-pointer"
                            strokeWidth={1}
                        />
                    </button>
                </div>
                <NavLinks lists={lists} />
                <div className="h-12 px-4 flex items-center">
                    <CreateListForm />
                </div>
            </div>
            <div
                className="flex-grow bg-[#00000050] md:hidden"
                onClick={handleToggleNav}
            ></div>
        </nav>
    );
}

export function NavLink({
    active,
    list,
}: {
    active: boolean;
    list: { id: string; name: string };
}) {
    const action = deleteListAction.bind(null, list.id);

    return (
        <div
            className={`flex items-center relative ${clsx({
                'font-light hover:bg-gray-100 dark:hover:bg-[#0D6EFD15]':
                    !active,
                'bg-[#0D6EFD20] hover:bg-[#0D6EFD25] dark:bg-[#ffffff20] before:absolute before:top-0 before:left-0 before:bg-[#0D6EFD] before:h-full before:w-[3px] font-normal':
                    active,
            })}`}
        >
            <Link
                prefetch={false}
                href={`/tasks/${list.id}`}
                className={`flex-grow h-12 pl-4 pr-1 flex items-center `}
            >
                <div className="flex">
                    <ListBulletIcon className="h-6 mr-4 " strokeWidth={1} />
                    {list.name}
                </div>
            </Link>
            {active && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        return false;
                    }}
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVerticalIcon
                                className="h-6 cursor-pointer"
                                strokeWidth={1}
                            />
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
                                                This action cannot be undone.
                                                This will permanently delete
                                                your list and remove all data of
                                                list from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <form action={action}>
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
            )}
        </div>
    );
}

export function NavLinks({ lists }: { lists: Lists }) {
    const pathname = usePathname();

    return (
        <ul className="flex flex-col">
            {lists.map((item) => (
                <li key={item.id}>
                    <NavLink
                        active={`/tasks/${item.id}` === pathname}
                        list={item}
                    />
                </li>
            ))}
        </ul>
    );
}

export default Nav;
