'use client';

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';

import Button from '../button';
import { buttonProps } from '../nav/nav-buttons';
import { cn } from '@/lib/utils';
import {
    ClearCurrentListButton,
    DeleteCurrentListButton,
} from '../list-options/list-option-buttons';
import { ShareButton } from '../share-list/share';
import useStore from '@/lib/stores/index.store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IoIosSync } from 'react-icons/io';
import { useFetch } from '@/components/hook';
import { ShareDataType } from '@/lib/zod.schema';
import { IoOptionsOutline } from 'react-icons/io5';

export type ShareData = {
    data: ShareDataType;
};

export const SyncButton = ({ autoSync = false }: { autoSync?: boolean }) => {
    const [auto, setAuto] = useState(false);
    const currentList = useStore((s) => s.currentList);
    const [time, setTime] = useState(0);
    const ref = useRef(0);
    const refreshCurrentList = useStore((s) => s.refreshCurrentList);

    const { data } = useFetch<ShareData>(
        `/v1/api/share/lists/${currentList?.id}`
    );

    useEffect(() => {
        if (!autoSync) return;
        if (!data) return;
        if (data.data.Share.length === 0) return;

        setAuto(true);

        const id = setInterval(() => {
            if (ref.current < 30) {
                setTime(++ref.current);
            } else {
                refreshCurrentList();
                ref.current = 0;
                setTime(ref.current);
            }
        }, 1000);

        return () => {
            clearInterval(id);
        };
    }, [autoSync, data, refreshCurrentList]);

    const onClick = useCallback(() => {
        refreshCurrentList();
        ref.current = 0;
        setTime(ref.current);
    }, [refreshCurrentList]);

    return (
        <Button
            onClick={onClick}
            variant="ghost"
            className={cn(
                buttonProps.className,
                ' px-3 py-1.5 flex justify-start items-center font-light'
            )}
        >
            <IoIosSync className="h-5 w-4 mr-2" />
            <div className="flex-grow text-start">Refresh</div>
            <div>{auto && time}</div>
        </Button>
    );
};

export const ListOption = ({
    clearList = false,
    deleteList = false,
    refresh = false,
}: {
    clearList?: boolean;
    deleteList?: boolean;
    refresh?: boolean;
}) => {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant="ghost"
                        className={cn(buttonProps.className, 'p-1 select-none')}
                    >
                        <EllipsisHorizontalIcon className="h-6 w-6 opacity-70" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="transition-all w-40 duration-75 p-1">
                    {refresh && <SyncButton autoSync />}

                    {clearList && <ClearCurrentListButton />}

                    {deleteList && <DeleteCurrentListButton />}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export const ListHeader = () => {
    const ref = useRef<HTMLHeadElement>(null);
    const currentList = useStore((s) => s.currentList);
    const [isShowTitle, setIsShowTitle] = useState(false);
    const lists = useStore((s) => s.lists);

    const IsMyList = useMemo(
        () => lists.some((item) => item.id === currentList?.id),
        [currentList?.id, lists]
    );

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
            {currentList && (
                <div
                    className={cn(
                        'absolute font-semibold -translate-x-1/2 left-1/2 transition-all opacity-0 translate-y-5',
                        {
                            'opacity-100 translate-y-0': isShowTitle,
                        }
                    )}
                >
                    {currentList.name}
                </div>
            )}

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
                <ShareButton />
                <ListOption clearList deleteList={IsMyList} refresh />
            </div>
        </header>
    );
};

export const Header = ({ listTitle }: { listTitle: string }) => {
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
                {listTitle}
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
            </div>
        </header>
    );
};
