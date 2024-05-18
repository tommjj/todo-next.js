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

export const AppHeader = () => {
    const currentList = useStore((s) => s.currentList);
    const lists = useStore((s) => s.lists);

    const IsMyList = useMemo(
        () => lists.some((item) => item.id === currentList?.id),
        [currentList?.id, lists]
    );

    return (
        <header className="flex items-center justify-between w-full h-14 px-3">
            <div></div>
            <div className="flex gap-2">
                <ShareButton />
                <ListOption clearList deleteList={IsMyList} refresh />
            </div>
        </header>
    );
};
