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

export const ListOption = ({
    clearList = false,
    deleteList = false,
}: {
    clearList?: boolean;
    deleteList?: boolean;
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
                    {clearList && <ClearCurrentListButton />}

                    {deleteList && <DeleteCurrentListButton />}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export const AppHeader = () => {
    return (
        <header className="flex items-center justify-between w-full h-14 px-3">
            <div></div>
            <div className="flex gap-2">
                <ShareButton />
                <ListOption clearList deleteList />
            </div>
        </header>
    );
};
