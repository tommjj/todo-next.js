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
import AlertDialog, {
    AlertDialogContent,
    AlertDialogTrigger,
    DialogRef,
} from '../alert-dialog/alert-dialog';
import { cn } from '@/lib/utils';
import { buttonProps } from '../nav/nav-buttons';
import Button from '../button';
import { useFetch } from '@/components/hook';
import useStore from '@/lib/stores/index.store';
import { ShareDataType } from '@/lib/zod.schema';
import { ShareListContent } from './share-content';
import { ShareListFooter } from './share-footer';

const ShareContext = createContext<
    null | [ShareDataType, React.Dispatch<SetStateAction<ShareDataType>>]
>(null);

export const useShareContext = () => {
    const context = useContext(ShareContext);
    if (!context) throw new Error('share context');
    return context;
};

export type ShareData = {
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
        <AlertDialog ref={dialogRef}>
            <AlertDialogTrigger>
                <Button
                    variant="ghost"
                    className={cn(buttonProps.className, 'p-1 select-none', {
                        'mr-2': !data,
                    })}
                >
                    <AiOutlineUserGroupAdd className="h-6 w-6 p-[1px] opacity-70" />
                    {shareState && shareState.Share.length + 1}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
                className="bg-[#00000030] backdrop-blur-none"
                ContentClassName="py-0 px-0 md:w-[380px] rounded-lg"
            >
                <div className="flex flex-col w-full h-[520px]">
                    <div className="flex items-center justify-between w-full opacity-90 pt-1 pb-1.5 pl-3 pr-2 border-b">
                        <div className="font-bold text-xl mt-2">Share List</div>
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
                        <ShareContext.Provider
                            value={[
                                shareState,
                                setShareState as React.Dispatch<
                                    SetStateAction<ShareDataType>
                                >,
                            ]}
                        >
                            <ShareListContent />
                            <ShareListFooter />
                        </ShareContext.Provider>
                    )}
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};
