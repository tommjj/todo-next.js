'use client';

import useStore from '@/lib/stores/app.store';
import ResizeContainer from '../resize-container';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import BottomBar from './bottom-bar';
import Button from '../button';

export default function DetailsContainer({ id }: { id: string }) {
    const [maxWidth, setMaxWidth] = useState(700);
    const { board } = useParams();
    const list = useStore((state) => state.list);
    const isOpenNav = useStore((state) => state.isOpenNav);
    const ref = useRef<HTMLDivElement>(null);
    const task = list && list.tasks?.find((e) => e.id === id);

    const moveItem = useStore((state) => state.moveItem);

    const { push } = useRouter();

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
    }, [task, isOpenNav]);

    return (
        <>
            {task && (
                <aside
                    ref={ref}
                    className="absolute left-0 top-0 flex h-full w-full lg:w-auto lg:relative z-20 "
                >
                    <div
                        onClick={handleClickOverlay}
                        className="h-full flex-grow bg-[#00000040] min-w-[50px] lg:hidden"
                    ></div>
                    <ResizeContainer
                        className="bg-white dark:bg-[#111]  flex flex-col  lg:shadow-[-2px_0_5px_rgba(0,0,0,0.2)] "
                        defaultWidth={360}
                        minWidth={360}
                        maxWidth={maxWidth}
                    >
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
