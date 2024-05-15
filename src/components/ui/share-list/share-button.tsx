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
import { useFetch } from '@/components/hook';
import useStore from '@/lib/stores/index.store';
import { ShareDataType } from '@/lib/zod.schema';
import { useSession } from '@/components/session-context';

export const ShareListContent = ({
    shareData,
}: {
    shareData: ShareDataType;
}) => {
    const session = useSession();
    const isOwner = session.id === shareData.user.id;

    return (
        <>
            {shareData.Share.length === 0 ? (
                <div className="flex flex-col text-center items-center justify-center flex-grow">
                    <GoShareAndroid className="w-44 h-44 opacity-70" />
                    <div className="font-semibold mt-2 mb-2">
                        Collaborate with friends and family
                    </div>
                    <div className="font-light text-[0.8rem] px-10">
                        Invite others to finally get on top of those household
                        chores or plan that dream holiday.
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-full pt-3 px-4 flex-grow border-b overflow-hidden">
                    <div className="text-sm opacity-90 mb-1">Members</div>
                    <div className="flex-grow overflow-y-auto custom-scrollbar">
                        <ul className="flex flex-col gap-0.5 ">
                            {[
                                shareData.user,
                                ...shareData.Share.map((user) => ({
                                    ...user.user,
                                })),
                            ].map((item) => (
                                <li key={item.id}>
                                    <div
                                        className={
                                            'flex py-1 items-center px-0 font-normal'
                                        }
                                    >
                                        <div className="flex-grow flex items-center">
                                            <div className="h-8 w-8 text-[0.8rem] font-semibold flex justify-center items-center border rounded-full mr-3 bg-[#00000020]">
                                                {item.name.substring(0, 2)}
                                            </div>
                                            <div className="text-base">
                                                {item.name}
                                            </div>
                                        </div>
                                        <div className="text-[0.8rem] flex items-center opacity-80">
                                            {item.id === shareData.user.id &&
                                                'Owner'}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {!isOwner ? (
                <div className="w-full px-4 pt-4 mb-2">
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText('my link');
                        }}
                        variant="ghost"
                        className="w-full px-3 py-2 mb-2 border text-red-500 font-medium"
                    >
                        leave
                    </Button>
                </div>
            ) : (
                <div className="w-full px-4 pt-2 mb-2">
                    <div className="flex">
                        {shareData.shareToken ? (
                            <>
                                <div className="bg-[#00000008] mb-2 p-2 rounded flex-grow">
                                    link
                                </div>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            'my link'
                                        );
                                    }}
                                    variant="primary"
                                    className="px-3 py-2 mb-2"
                                >
                                    <FaRegCopy />
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => {
                                    navigator.clipboard.writeText('my link');
                                }}
                                variant="primary"
                                className="w-full py-2 mb-2"
                            >
                                Create new link
                            </Button>
                        )}
                    </div>
                    <div className="text-center font-light text-[0.8rem] px-10">
                        Anyone with this link can participate in editing this
                        list
                    </div>
                </div>
            )}
        </>
    );
};

type ShareData = {
    data: ShareDataType;
};

export const ShareButton = () => {
    const currentList = useStore((s) => s.currentList)!;
    const dialogRef = useRef<DialogRef>(null);
    const { data } = useFetch<ShareData>(
        `/v1/api/share/lists/${currentList.id}`
    );

    const handleClose = useCallback(() => {
        dialogRef.current?.setIsOpen(false);
    }, []);

    return (
        <AlertDialog ref={dialogRef}>
            <AlertDialogTrigger>
                <Button
                    variant="ghost"
                    className={cn(buttonProps.className, 'p-1 select-none', {
                        'mr-2': !data,
                    })}
                >
                    <AiOutlineUserGroupAdd className="h-6 w-6 opacity-70" />
                    {data && data.data.Share.length + 1}
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
                    {currentList && data?.data && (
                        <ShareListContent shareData={data.data} />
                    )}
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};
