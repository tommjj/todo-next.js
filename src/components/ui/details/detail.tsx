'use client';

import useStore from '@/lib/stores/index.store';
import { ResizeContainer } from '../resize-container';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import BottomBar from './bottom-bar';
import Button from '../button';
import { Test } from '@/components/session-context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import { cn } from '@/lib/utils';

const StorageKey = 'detailWidth';

const getStateFromStorage = (): number | undefined => {
    try {
        const state = localStorage?.getItem(StorageKey);
        if (!state) return undefined;
        return Number(state);
    } catch (err) {
        return undefined;
    }
};

export default function DetailsContainer({ id }: { id?: string }) {
    const [width] = useState(getStateFromStorage() || 360);
    const [maxWidth, setMaxWidth] = useState(900);
    const { board } = useParams();
    const list = useStore((state) => state.list);
    const ref = useRef<HTMLDivElement>(null);

    const { push } = useRouter();

    const task = list && list.tasks?.find((e) => e.id === id);

    const handleClose = useCallback(() => {
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
            <aside
                className={cn(
                    'flex absolute right-0 top-0 w-full h-full md:relative md:w-auto z-50',
                    {
                        'w-0 delay-300 transition-all duration-0': !task,
                    }
                )}
            >
                <div
                    className={cn(
                        'flex-grow h-full bg-[#00000050] md:hidden z-40 opacity-100 transition-all duration-300',
                        { 'opacity-0': !task }
                    )}
                    onClick={handleClose}
                ></div>
                <ResizeContainer
                    className={cn(
                        ' bg-nav-bg-color dark:bg-nav-bg-color-dark h-full z-50',
                        {
                            'max-w-[360px] md:max-w-[360px] -ml-[360px] translate-x-[360px]':
                                !task,
                        }
                    )}
                    defaultWidth={width}
                    minWidth={360}
                    maxWidth={maxWidth}
                    resizeDir="Left"
                    onSizeChanged={handleSizeChanged}
                >
                    <div className="w-full h-full">
                        <Button onClick={handleClose}>click</Button>
                    </div>
                </ResizeContainer>
            </aside>
            {/* {task && (
                <aside
                    ref={ref}
                    className="absolute left-0 top-0 flex h-full w-full lg:w-auto lg:relative z-50"
                >
                    <div
                        onClick={handleClose}
                        className="h-full flex-grow bg-[#00000040] min-w-[50px] lg:hidden"
                    ></div>
                    <ResizeContainer
                        className="bg-nav-bg-color dark:bg-nav-bg-color-dark  flex flex-col relative"
                        defaultWidth={Number(
                            localStorage.getItem(StorageKey) || 360
                        )}
                        minWidth={360}
                        maxWidth={maxWidth}
                        resizeDir="Left"
                        onSizeChanged={handleSizeChanged}
                    >
                        <div className="w-full flex-grow  p-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="dark">Click me!</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <div
                                        className="w-36 h-[600px]"
                                        onClick={(e) => {
                                            console.log('click');
                                        }}
                                    >
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.nativeEvent.stopImmediatePropagation();
                                            }}
                                        >
                                            cc
                                        </Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <BottomBar task={task} />
                    </ResizeContainer>
                </aside>
            )} */}
        </>
    );
}
