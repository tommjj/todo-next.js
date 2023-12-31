'use client';

import useStore from '@/store/store';
import ResizeContainer from '../resize-container';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import BottomBar from './bottom-bar';
import Button from '../button';
import { toast } from '../sonner/sonner';

export default function DetailsContainer({ id }: { id: string }) {
    const [maxWidth, setMaxWidth] = useState(700);
    const list = useStore((state) => state.list);
    const isOpenNav = useStore((state) => state.isOpenNav);
    const ref = useRef<HTMLDivElement>(null);
    const task = list && list.tasks?.find((e) => e.id === id);

    const pathname = usePathname();
    const { push } = useRouter();

    const handleClickOverlay = useCallback(() => {
        push(pathname);
    }, [pathname, push]);

    useEffect(() => {
        const handleResize = () => {
            const element = ref.current;
            if (!element) return;

            const w = element.parentElement?.getBoundingClientRect().width;

            if (w && window.innerWidth > 1024) {
                console.log(w);
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
                        <div className="w-full flex-grow  p-2">
                            <Button
                                onClick={() => {
                                    toast({
                                        title: 'deleted',
                                        description: `deleted ${Date.now()}`,
                                        callBack: async () => {},
                                        action: {
                                            label: 'cancel',
                                            onClick: () => {},
                                        },
                                    });
                                }}
                                variant="dark"
                            >
                                Click me!
                            </Button>
                        </div>
                        <BottomBar task={task} />
                    </ResizeContainer>
                </aside>
            )}
        </>
    );
}
