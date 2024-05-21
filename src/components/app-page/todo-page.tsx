'use client';

import { useLoadList } from '@/components/hook';
import AppTitle from '../ui/task/app-title';
import { ListViewCreateTask } from '../ui/task/create-task';
import SortTasksListContainer from '../ui/task/sort-list-container';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../ui/drop-down-menu/drop-down-menu';
import Button from '../ui/button';
import { buttonProps } from '../ui/nav/nav-buttons';
import { cn } from '@/lib/utils';

import { useEffect, useRef, useState } from 'react';
import { IoOptionsOutline } from 'react-icons/io5';
import { ListOption } from '../ui/header/main-header';

export const Header = () => {
    const ref = useRef<HTMLHeadElement>(null);
    const [isShowTitle, setIsShowTitle] = useState(false);

    useEffect(() => {
        const element = ref.current;
        const parentElement = ref.current?.parentElement;

        if (!element || !parentElement) return;

        const handler = () => {
            setIsShowTitle(parentElement.scrollTop > 50);
        };

        parentElement.addEventListener('scroll', handler);

        return () => {
            parentElement.removeEventListener('scroll', handler);
        };
    }, []);

    return (
        <header
            ref={ref}
            className="flex items-center justify-between w-full h-14 px-3 sticky top-0 left-0 bg-main-bg-color dark:bg-main-bg-color-dark z-20"
        >
            <div></div>
            <div
                className={cn(
                    'absolute font-semibold -translate-x-1/2 left-1/2 transition-all opacity-0 translate-y-5',
                    {
                        'opacity-100 translate-y-0': isShowTitle,
                    }
                )}
            >
                Todo
            </div>

            <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            className={cn(
                                buttonProps.className,
                                'p-1 select-none'
                            )}
                        >
                            <IoOptionsOutline className="h-6 w-6 p-[1px] opacity-70" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="transition-all duration-75 p-1">
                        <div className="w-[500px] h-96"></div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ListOption clearList />
            </div>
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
