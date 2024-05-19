'use client';

import { useParams, useRouter } from 'next/navigation';
import Button from '../button';

import { GoHash } from 'react-icons/go';
import { IoIosArrowForward } from 'react-icons/io';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { buttonProps, getButtonClassName } from './nav-buttons';
import useStore from '@/lib/stores/index.store';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

import {
    DropdownMenu,
    DropdownMenuContent,
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
import ListEditor from '../lists/list-editor';
import { CiLogout } from 'react-icons/ci';

export const NavLink = ({
    list,
}: {
    list: {
        id: string;
        name: string;
        color: string | null;
    };
}) => {
    const { board } = useParams();

    const { replace } = useRouter();
    const removeShareList = useStore((s) => s.removeShareList);

    const handleLeave = useCallback(() => {
        const { sync, nextId, privId } = removeShareList(list.id);
        if (board === list.id) {
            replace(`/tasks/${privId || nextId || 'todo'}`);
        }
        sync();
    }, [removeShareList, list.id, board, replace]);

    return (
        <div className="relative flex items-center group overflow-hidden ">
            <Button
                variant="ghost"
                href={`/tasks/${list.id}`}
                className={`${getButtonClassName(board === list.id)} `}
            >
                <div>
                    <GoHash className="w-6 h-6 p-[0.20rem] mr-[8px] text-[#444] dark:text-inherit" />
                </div>
                <div className="flex-grow line-clamp-1 text-left">
                    {list.name}
                </div>
            </Button>
            <div className="absolute right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            className={cn(
                                buttonProps.className,
                                'p-[1px] select-none opacity-50 md:opacity-0 md:group-hover:opacity-50'
                            )}
                        >
                            <EllipsisHorizontalIcon className="h-[20px] w-[20px] " />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-1">
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        buttonProps.className,
                                        ' w-36 px-3 py-1 text-red-600 flex justify-start items-center font-light'
                                    )}
                                >
                                    <CiLogout className="h-4 mr-2" />
                                    Leave list
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            onClick={handleLeave}
                                            type="button"
                                            variant="destructive"
                                        >
                                            Continue
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export const NavShareLinks = () => {
    const lists = useStore((s) => s.shareLists);
    const [isOpen, setIsOpen] = useState(true);
    const [editId, setEditId] = useState<undefined | string>(undefined);

    const toggleList = useCallback(() => setIsOpen((priv) => !priv), []);
    const handleCloseEdit = useCallback(() => {
        setEditId(undefined);
    }, []);

    return (
        <>
            {lists.length === 0 ? null : (
                <div className="px-[10px] w-full ">
                    <Button
                        onClick={toggleList}
                        className="group px-[10px] py-[5px] justify-between w-full grow font-normal text-base"
                        variant="ghost"
                    >
                        Share lists
                        <div className="p-0 rounded-sm">
                            <IoIosArrowForward
                                className={cn(
                                    'h-6 w-6 p-1 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100',
                                    {
                                        'rotate-90': isOpen,
                                    }
                                )}
                            />
                        </div>
                    </Button>
                    <ul
                        className={cn(
                            'overflow-hidden transition-all duration-300'
                        )}
                        style={{
                            maxHeight: `${isOpen ? lists.length * 50 : 0}px`,
                        }}
                    >
                        {lists.map((item) => (
                            <li key={item.id}>
                                {editId === item.id ? (
                                    <ListEditor
                                        list={item}
                                        onClose={handleCloseEdit}
                                    />
                                ) : (
                                    <NavLink list={item} />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};
