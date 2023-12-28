'use client';

import useStore from '@/store/store';
import ResizeContainer from '../resize-container';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import BottomBar from './bottom-bar';

export default function DetailsContainer({ id }: { id: string }) {
    const list = useStore((state) => state.list);

    const task = list && list.tasks?.find((e) => e.id === id);

    const pathname = usePathname();
    const { push } = useRouter();

    const handleClickOverlay = useCallback(() => {
        push(pathname);
    }, [pathname, push]);

    return (
        <>
            {task && (
                <div className="absolute left-0 top-0 flex h-full w-full lg:w-auto lg:relative z-10 lg:shadow-[-2px_0_5px_rgba(0,0,0,0.2)]">
                    <div
                        onClick={handleClickOverlay}
                        className="h-full flex-grow bg-[#00000040] min-w-[50px] lg:hidden"
                    ></div>
                    <ResizeContainer
                        className="bg-white dark:bg-[#111] flex-auto flex flex-col "
                        defaultWidth={360}
                        minWidth={360}
                        maxWidth={700}
                    >
                        <div className="w-full flex-grow ">Details</div>
                        <BottomBar task={task} />
                    </ResizeContainer>
                </div>
            )}
        </>
    );
}
