'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useState } from 'react';

import { Lists } from '@/lib/definitions';
import clsx from 'clsx';
import CreateListForm from '../create-list/create-list-form';
import {
    ListBulletIcon,
    EllipsisVerticalIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
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
import { useNavContext } from './nav-context';
import NoSSR from '@/components/NoSSR';
import NavHeader from './nav-header';
import {
    AddTaskButton,
    SearchButton,
    ImportantButton,
    PlannedButton,
    TodoButton,
} from './nav-buttons';
import { ResizeContainer } from '../resize-container';
import { cn } from '@/lib/utils';

function Nav({ lists }: { lists: Lists }) {
    const { isOpen, width, setWidth, closeNav, openNav, toggleNav } =
        useNavContext();
    const [isSmS, setIsSmS] = useState(false);

    const { board } = useParams();

    useLayoutEffect(() => {
        if (window.innerWidth < 768) {
            setIsSmS(true);
        } else {
            setIsSmS(false);
        }
    }, []);

    useEffect(() => {
        const handleResize = (e: Event) => {
            const target = e.target as Window;

            if (target.innerWidth < 768) {
                setIsSmS(true);
            } else {
                setIsSmS(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isSmS) {
            //closeNav();
        } else {
            openNav();
        }
    }, [isSmS, board, closeNav, openNav]);

    return (
        <NoSSR>
            <aside
                className={cn(
                    'flex absolute top-0 left-0 w-full h-full md:relative  md:w-auto'
                )}
            >
                <ResizeContainer
                    className={cn(
                        'max-w-[300px] bg-nav-bg-color dark:bg-nav-bg-color-dark h-full md:max-w-[416px] z-50 ',
                        {
                            'max-w-[220px] md:max-w-[220px] -mr-[220px] -translate-x-[220px]':
                                !isOpen,
                        }
                    )}
                    defaultWidth={width}
                    minWidth={220}
                    maxWidth={416}
                    resizeDir="Right"
                    onSizeChanged={setWidth}
                >
                    <nav className={`flex w-full relative `}>
                        <div className="w-full inset-0 ">
                            <NavHeader />

                            <AddTaskButton />
                            <NavItems />
                            {/* <NavLinks lists={lists} /> */}

                            <div className="h-12 px-4 flex items-center">
                                <CreateListForm />
                            </div>
                        </div>
                    </nav>
                </ResizeContainer>

                <div
                    className={cn(
                        'flex-grow h-full bg-[#00000050] md:hidden z-40',
                        { hidden: !isOpen }
                    )}
                    onClick={toggleNav}
                ></div>
            </aside>
        </NoSSR>
    );
}
//ImportantButton,PlannedButton, TodoButton
export const NavItems = () => {
    return (
        <ul className="w-full px-[10px]">
            <li>
                <SearchButton />
            </li>
            <li>
                <TodoButton />
            </li>
            <li>
                <ImportantButton />
            </li>
            <li>
                <PlannedButton />
            </li>
        </ul>
    );
};

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
    const { board } = useParams();

    return (
        <ul className="flex flex-col">
            {/* {lists.map((item) => (
                <li key={item.id}>
                    <NavLink active={`${item.id}` === board} list={item} />
                </li>
            ))} */}
        </ul>
    );
}

export default Nav;
