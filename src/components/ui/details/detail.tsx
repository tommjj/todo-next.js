'use client';

import useStore from '@/lib/stores/index.store';
import { ResizeContainer } from '../resize-container';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import BottomBar from './bottom-bar';
import Button from '../button';
import { Test } from '@/components/session-context';

const StorageKey = 'detailWidth';

export default function DetailsContainer({ id }: { id: string }) {
    const [maxWidth, setMaxWidth] = useState(900);
    const { board } = useParams();
    const list = useStore((state) => state.list);
    const ref = useRef<HTMLDivElement>(null);

    const moveItem = useStore((state) => state.moveItem);

    const { push } = useRouter();

    const task = list && list.tasks?.find((e) => e.id === id);

    const handleClickOverlay = useCallback(() => {
        push(`/tasks/${board}`);
    }, [board, push]);

    useEffect(() => {
        const handleResize = () => {
            const element = ref.current;
            if (!element) return;

            const w = element.parentElement?.getBoundingClientRect().width;

            if (w && window.innerWidth > 1024) {
                setMaxWidth(w - 350);
            } else {
                setMaxWidth(700);
            }
        };
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [task]);

    const handleSizeChanged = useCallback((w: number) => {
        localStorage.setItem(StorageKey, w.toString());
    }, []);
    return (
        <>
            {task && (
                <aside
                    ref={ref}
                    className="absolute left-0 top-0 flex h-full w-full lg:w-auto lg:relative lg:border-l z-50"
                >
                    <div
                        onClick={handleClickOverlay}
                        className="h-full flex-grow bg-[#00000040] min-w-[50px] lg:hidden"
                    ></div>
                    <ResizeContainer
                        className="bg-white dark:bg-[#111]  flex flex-col relative"
                        defaultWidth={Number(
                            localStorage.getItem(StorageKey) || 360
                        )}
                        minWidth={360}
                        maxWidth={maxWidth}
                        resizeDir="Left"
                        onSizeChanged={handleSizeChanged}
                    >
                        <Test></Test>
                        <div
                            className="w-full flex-grow  p-2"
                            onClick={() => {
                                moveItem(0, 2);
                            }}
                        >
                            <Button variant="dark">Click me!</Button>
                        </div>
                        <BottomBar task={task} />
                    </ResizeContainer>
                </aside>
            )}
        </>
    );
}
