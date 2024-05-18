'use client';

import Avatar from '@/components/avatar';
import { useSession } from '@/components/session-context';
import { GoShareAndroid } from 'react-icons/go';
import Button from '../button';
import { LiaTimesSolid } from 'react-icons/lia';
import { useShareContext } from './share';
import { fetcher } from '@/lib/http';
import { useCallback } from 'react';

export const UserItem = ({
    user,
    isOwner,
}: {
    isOwner: boolean;
    user: { id: string; name: string };
}) => {
    const [shareData, setShareData] = useShareContext();

    const onClick = useCallback(() => {
        fetcher
            .delete(`/v1/api/share/lists/${shareData.id}/user/${user.id}`)
            .then(([res]) => {
                if (res?.ok) {
                    setShareData((priv) => ({
                        ...priv,
                        Share: priv.Share.filter(
                            (share) => share.user.id !== user.id
                        ),
                    }));
                }
            });
    }, [setShareData, shareData.id, user.id]);

    return (
        <div className={'flex py-1 items-center px-0 font-normal'}>
            <div className="flex-grow flex items-center">
                <Avatar name={user.name} />
                <div className="text-base">{user.name}</div>
            </div>
            <div className="text-[0.8rem] flex items-center opacity-80">
                {user.id === shareData.user.id ? (
                    'Owner'
                ) : isOwner ? (
                    <Button
                        variant="ghost"
                        className="px-1 py-1 mb-2"
                        onClick={onClick}
                    >
                        <LiaTimesSolid className="h-5 w-5" />
                    </Button>
                ) : null}
            </div>
        </div>
    );
};

export const ShareListContent = () => {
    const [shareData, setShareData] = useShareContext();
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
                                    <UserItem isOwner={isOwner} user={item} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};
