'use client';

import useStore from '@/lib/stores/index.store';
import { ResizeContainer } from '../resize-container';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { DetailHeader } from './detail-header';
import { DetailTaskView } from './detail-task-view';

const STORAGE_KEY = 'detailWidth';

const getStateFromStorage = (): number | undefined => {
    try {
        const state = localStorage?.getItem(STORAGE_KEY);
        if (!state) return undefined;
        return Number(state);
    } catch (err) {
        return undefined;
    }
};

export default function DetailsContainer() {
    const searchParam = useSearchParams();
    const [width] = useState(getStateFromStorage() || 360);
    const [maxWidth, setMaxWidth] = useState(900);
    const tasks = useStore((state) => state.tasks);
    const ref = useRef<HTMLDivElement>(null);
    const id = searchParam.get('details');
    const { push } = useRouter();

    const task = tasks.find((e) => e.id === id);

    const handleClose = useCallback(() => {
        const param = new URLSearchParams(searchParam);
        param.delete('details');
        push(`?${param.toString()}`);
    }, [push, searchParam]);

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
        localStorage.setItem(STORAGE_KEY, w.toString());
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
                        'max-w-[380px] md:max-w-[900px] bg-nav-bg-color dark:bg-nav-bg-color-dark h-full z-50',
                        {
                            'max-w-[380px] md:max-w-[360px] -ml-[360px] translate-x-[360px]':
                                !task,
                        }
                    )}
                    defaultWidth={width}
                    minWidth={360}
                    maxWidth={maxWidth}
                    resizeDir="Left"
                    onSizeChanged={handleSizeChanged}
                >
                    <div className="flex flex-col w-full h-full">
                        <DetailHeader task={task} />
                        <DetailTaskView taskId={task?.id} />
                    </div>
                </ResizeContainer>
            </aside>
        </>
    );
}
