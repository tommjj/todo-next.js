'use client';

import { AiOutlineUsergroupAdd as AiOutlineUserGroupAdd } from 'react-icons/ai';
import { LiaTimesSolid } from 'react-icons/lia';
import { useCallback, useRef } from 'react';
import { FaRegCopy } from 'react-icons/fa';

import AlertDialog, {
    AlertDialogContent,
    AlertDialogTrigger,
    DialogRef,
} from '../alert-dialog/alert-dialog';
import { cn } from '@/lib/utils';
import { buttonProps } from '../nav/nav-buttons';
import Button from '../button';
import { GoShareAndroid } from 'react-icons/go';

export const ShareListContent = () => {
    return (
        <>
            {false ? (
                <>
                    <div className="flex flex-col w-full pt-3 px-4 flex-grow border-b overflow-hidden">
                        <div className="text-sm opacity-90 mb-1">Members</div>
                        <div className="flex-grow overflow-y-auto custom-scrollbar">
                            <ul className="flex flex-col gap-0.5 ">
                                <li>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            buttonProps.className,
                                            'md:hover:bg-[#00000000] px-0 font-normal text-[0.9rem]'
                                        )}
                                    >
                                        {' '}
                                        <div className="h-7 w-7 text-sm font-semibold flex justify-center items-center border rounded-full mr-3 bg-[#00000020]">
                                            {'User 01'.substring(0, 2)}
                                        </div>
                                        User 01
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full px-4 pt-2 mb-2">
                        <div className="flex">
                            <div className="bg-[#00000008] mb-2 p-2 rounded flex-grow">
                                link
                            </div>
                            <Button
                                onClick={() => {
                                    navigator.clipboard.writeText('my link');
                                }}
                                variant="primary"
                                className="px-3 py-2 mb-2"
                            >
                                <FaRegCopy />
                            </Button>
                        </div>
                        <div className="text-center font-light text-[0.8rem] px-10">
                            Anyone with this link can participate in editing
                            this list
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col text-center items-center justify-center flex-grow">
                        <GoShareAndroid className="w-44 h-44 opacity-70" />
                        <div className="font-semibold mt-2 mb-2">
                            Collaborate with friends and family
                        </div>
                        <div className="font-light text-[0.8rem] px-10">
                            Invite others to finally get on top of those
                            household chores or plan that dream holiday.
                        </div>
                    </div>
                    <div className="w-full px-4 pt-2 mb-2">
                        <div className="flex">
                            <Button
                                onClick={() => {
                                    navigator.clipboard.writeText('my link');
                                }}
                                variant="primary"
                                className="w-full py-2 mb-2"
                            >
                                Create new link
                            </Button>
                        </div>
                        <div className="text-center font-light text-[0.8rem] px-10">
                            Anyone with this link can participate in editing
                            this list
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export const ShareButton = () => {
    const dialogRef = useRef<DialogRef>(null);

    const handleClose = useCallback(() => {
        dialogRef.current?.setIsOpen(false);
    }, []);

    return (
        <AlertDialog ref={dialogRef}>
            <AlertDialogTrigger>
                <Button
                    variant="ghost"
                    className={cn(buttonProps.className, 'p-1 select-none')}
                >
                    <AiOutlineUserGroupAdd className="h-6 w-6 opacity-70" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
                className="bg-[#00000030] backdrop-blur-none"
                ContentClassName="py-0 px-0 md:w-[380px] rounded-lg"
            >
                <div className="flex flex-col w-full h-[480px] ">
                    <div className="flex items-center justify-between w-full opacity-90 pt-1 pb-1.5 pl-3 pr-2 border-b">
                        <div className="font-semibold text-xl mt-2">
                            Share List
                        </div>
                        <div>
                            <Button
                                {...buttonProps}
                                className={cn(
                                    buttonProps.className,
                                    'px-0.5 py-0.5'
                                )}
                                onClick={handleClose}
                            >
                                <LiaTimesSolid className="h-6 w-6 p-[2px] opacity-70" />
                            </Button>
                        </div>
                    </div>
                    <ShareListContent />
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};
