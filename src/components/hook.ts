'use client';

import { fetcher, getListById } from '@/lib/http';
import useStore from '@/lib/stores/index.store';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const useDrag = () => {
    const ref = useRef<any>();
    const [state, setState] = useState({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        translateX: 0,
        translateY: 0,
    });

    //handle drag start
    useEffect(() => {
        if (!ref.current) return;
        const element = ref.current;
        const handleMouseDown = (e: MouseEvent) => {
            window?.getSelection()?.removeAllRanges();

            setState({
                isDragging: true,
                startX: e.clientX,
                startY: e.clientY,
                currentX: e.clientX,
                currentY: e.clientY,
                translateX: 0,
                translateY: 0,
            });
        };
        const handleTouchStart = (e: TouchEvent) => {
            window?.getSelection()?.removeAllRanges();

            setState({
                isDragging: true,
                startX: e.changedTouches[0].clientX,
                startY: e.changedTouches[0].clientY,
                currentX: e.changedTouches[0].clientX,
                currentY: e.changedTouches[0].clientY,
                translateX: 0,
                translateY: 0,
            });
        };

        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('touchstart', handleTouchStart);

        return () => {
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('touchstart', handleTouchStart);
        };
    }, []);

    //handle drag
    useEffect(() => {
        if (!state.isDragging) return;
        const handleMouseMove = (e: MouseEvent) => {
            setState({
                isDragging: true,
                currentX: e.clientX,
                currentY: e.clientY,
                startX: state.startX,
                startY: state.startY,
                translateX: e.clientX - state.startX,
                translateY: e.clientY - state.startY,
            });
        };

        const handleTouchMove = (e: TouchEvent) => {
            setState({
                isDragging: true,
                currentX: e.changedTouches[0].clientX,
                currentY: e.changedTouches[0].clientY,
                startX: state.startX,
                startY: state.startY,
                translateX: e.changedTouches[0].clientX - state.startX,
                translateY: e.changedTouches[0].clientY - state.startY,
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, [state.isDragging, state.startX, state.startY]);

    // drag end
    useEffect(() => {
        if (!state.isDragging) return;
        const handleUp = () => {
            setState((priv) => ({
                ...priv,
                isDragging: false,
            }));
        };

        document.addEventListener('touchend', handleUp);
        document.addEventListener('mouseup', handleUp);

        return () => {
            document.removeEventListener('touchend', handleUp);
            document.removeEventListener('mouseup', handleUp);
        };
    }, [state.isDragging]);

    return { ...state, ref };
};

export const useLoadList = (listId: string) => {
    const setList = useStore((s) => s.setList);
    const [state, setState] = useState({
        isLoading: true,
        isNotFound: false,
    });

    useLayoutEffect(() => {
        getListById(listId).then(([list, err]) => {
            if (err) return setState({ isLoading: false, isNotFound: true });

            if (list) setList(list);
            setState({
                isLoading: false,
                isNotFound: false,
            });
        });

        return () => {
            setList(null);
        };
    }, [listId, setList]);

    return state;
};

export const useFetch = <T>(path?: string) => {
    const [state, setState] = useState<{
        data: undefined | T;
        isLoading: boolean;
        isNotFound: boolean;
    }>({
        data: undefined,
        isLoading: true,
        isNotFound: false,
    });

    useLayoutEffect(() => {
        if (!path) return;
        setState({
            data: undefined,
            isLoading: true,
            isNotFound: false,
        });
        fetcher.get(path).then(async ([res, err]) => {
            if (res?.ok) {
                setState({
                    data: await res.json(),
                    isLoading: false,
                    isNotFound: true,
                });

                return;
            }
            setState({
                data: undefined,
                isLoading: false,
                isNotFound: true,
            });
        });
    }, [path]);

    return state;
};
