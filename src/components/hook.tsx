import { useEffect, useRef, useState } from 'react';

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
        if (state.isDragging) return;
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
