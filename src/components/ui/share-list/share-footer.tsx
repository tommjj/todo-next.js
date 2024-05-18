'use client';

import { useCallback } from 'react';
import { useShareContext } from './share';
import { fetcher } from '@/lib/http';
import Button from '../button';
import { useSession } from '@/components/session-context';
import { FaRegCopy } from 'react-icons/fa';
import { MdDoNotDisturbAlt } from 'react-icons/md';

export const CreateLinkButton = () => {
    const [state, setState] = useShareContext();

    const handleCreate = useCallback(async () => {
        if (!state) return;
        const [res] = await fetcher.post(`/v1/api/share/lists/${state.id}`);

        if (res?.ok) {
            const data = (await res.json()).data;
            setState((priv) => ({
                ...priv,
                shareToken: data.shareToken,
            }));
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

const RemoveShareLink = () => {
    const [shareData, setShareData] = useShareContext();

    const handleRemove = useCallback(() => {
        fetcher
            .delete(`/v1/api/share/lists/${shareData.id}/token`)
            .then(([res]) => {
                if (res?.ok) {
                    setShareData((priv) => ({
                        ...priv,
                        shareToken: null,
                    }));
                }
            });
    }, [setShareData, shareData.id]);

    return (
        <Button
            onClick={handleRemove}
            variant="ghost"
            className="px-2 py-2 mb-2 flex-shrink-0 bg-red-50"
        >
            <MdDoNotDisturbAlt className="w-6 h-6 text-red-700" />
        </Button>
    );
};

export const ShareListFooter = () => {
    const [shareData] = useShareContext();
    const session = useSession();
    const isOwner = session.id === shareData.user.id;

    return (
        <>
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
                                <div className="relative bg-[#00000008] mb-2 p-2 rounded-s flex-grow overflow-x-scroll break-keep no-scrollbar text-nowrap whitespace-nowrap">
                                    {`${window.location.origin}/share/lists/${shareData.id}?InvitationTokens=${shareData.shareToken}`}
                                </div>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            `${window.location.origin}/share/lists/${shareData.id}?InvitationTokens=${shareData.shareToken}`
                                        );
                                    }}
                                    variant="ghost"
                                    className="px-3 py-2 mb-2 flex-shrink-0 mr-2 bg-[#00000008] hover:md:bg-[#00000012] rounded-none rounded-r"
                                >
                                    <FaRegCopy />
                                </Button>
                                <RemoveShareLink />
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
