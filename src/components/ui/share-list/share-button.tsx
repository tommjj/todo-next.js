'use client';

import { AiOutlineUsergroupAdd as AiOutlineUserGroupAdd } from 'react-icons/ai';
import { LiaTimesSolid } from 'react-icons/lia';
import {
    createContext,
    SetStateAction,
    useCallback,
    useContext,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
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
import { fetcher } from '@/lib/http';
import { MdDoNotDisturbAlt } from 'react-icons/md';
import Avatar from '@/components/avatar';

const ShareContext = createContext<
    | null
    | [
          ShareDataType | null,
          React.Dispatch<SetStateAction<ShareDataType | null>>
      ]
>(null);

const useShareContext = () => {
    const context = useContext(ShareContext);
    if (!context) throw new Error('share context');
    return context;
};

export const CreateLinkButton = () => {
    const [state, setState] = useShareContext();

    const handleCreate = useCallback(async () => {
        if (!state) return;
        const [res] = await fetcher.post(`/v1/api/share/lists/${state.id}`);

        if (res?.ok) {
            const data = (await res.json()).data;
            setState((priv) =>
                !priv
                    ? null
                    : {
                          ...priv,
                          shareToken: data.shareToken,
                      }
            );
        }
    }, [setState, state]);

    return (
        <Button
            onClick={handleCreate}
            variant="primary"
            className="w-full py-2 mb-2"
        >
            Create new link
        </Button>
    );
};

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
                                            <Avatar name={item.name} />
                                            <div className="text-base">
                                                {item.name}
                                            </div>
                                        </div>
                                        <div className="text-[0.8rem] flex items-center opacity-80">
                                            {item.id === shareData.user.id ? (
                                                'Owner'
                                            ) : isOwner ? (
                                                <Button
                                                    variant="ghost"
                                                    className="px-1 py-1 mb-2"
                                                >
                                                    <LiaTimesSolid className="h-5 w-5" />
                                                </Button>
                                            ) : null}
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
                                <div className="relative bg-[#00000008] mb-2 p-2 rounded flex-grow overflow-x-scroll break-keep no-scrollbar text-nowrap whitespace-nowrap">
                                    {`${window.location.origin}/share/lists/${shareData.id}?InvitationTokens=${shareData.shareToken}`}
                                </div>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            `${window.location.origin}/share/lists/${shareData.id}?InvitationTokens=${shareData.shareToken}`
                                        );
                                    }}
                                    variant="ghost"
                                    className="px-3 py-2 mb-2 flex-shrink-0 mr-2"
                                >
                                    <FaRegCopy />
                                </Button>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            `${window.location.origin}/share/lists/${shareData.id}?InvitationTokens=${shareData.shareToken}`
                                        );
                                    }}
                                    variant="ghost"
                                    className="px-2 py-2 mb-2 flex-shrink-0 bg-red-50"
                                >
                                    <MdDoNotDisturbAlt className="w-6 h-6 text-red-700" />
                                </Button>
                            </>
                        ) : (
                            <CreateLinkButton />
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
    const [shareState, setShareState] = useState<null | ShareDataType>(null);
    const currentList = useStore((s) => s.currentList)!;
    const dialogRef = useRef<DialogRef>(null);
    const { data } = useFetch<ShareData>(
        `/v1/api/share/lists/${currentList.id}`
    );

    useLayoutEffect(() => {
        if (data) setShareState(data.data);
    }, [data]);

    const handleClose = useCallback(() => {
        dialogRef.current?.setIsOpen(false);
    }, []);

    return (
        <ShareContext.Provider value={[shareState, setShareState]}>
            <AlertDialog ref={dialogRef}>
                <AlertDialogTrigger>
                    <Button
                        variant="ghost"
                        className={cn(
                            buttonProps.className,
                            'p-1 select-none',
                            {
                                'mr-2': !data,
                            }
                        )}
                    >
                        <AiOutlineUserGroupAdd className="h-6 w-6 opacity-70" />
                        {data && data.data.Share.length + 1}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                    className="bg-[#00000030] backdrop-blur-none"
                    ContentClassName="py-0 px-0 md:w-[380px] rounded-lg"
                >
                    <div className="flex flex-col w-full h-[520px]">
                        <div className="flex items-center justify-between w-full opacity-90 pt-1 pb-1.5 pl-3 pr-2 border-b">
                            <div className="font-bold text-xl mt-2">
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
                        {currentList && shareState && (
                            <ShareListContent shareData={shareState} />
                        )}
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </ShareContext.Provider>
    );
};
