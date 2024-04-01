'use client';

import clsx from 'clsx';
import {
    MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

type Props = {
    defaultWidth: number;
    className?: string;
    minWidth?: number;
    maxWidth?: number;
    children?: React.ReactNode;
};

function ResizeContainer({
    className = '',
    children,
    defaultWidth,
    minWidth = 0,
    maxWidth = 9999,
}: Props) {
    const [width, setWidth] = useState(defaultWidth);
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);
    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleMouseDown: MouseEventHandler = useCallback((e) => {
        if (e.button === 0) {
            window?.getSelection()?.removeAllRanges();
            setIsMouseDown(true);
        }
        setIsMouseDown(true);
    }, []);

    useEffect(() => {
        setWidth((priv) =>
            priv > maxWidth ? maxWidth : priv < minWidth ? minWidth : priv
        );
    }, [maxWidth, minWidth]);

    useEffect(() => {
        if (!ref.current) return;
        if (!isMouseDown) return;

        const handleMouseMove = (e: MouseEvent) => {
            window?.getSelection()?.removeAllRanges();

            var rect = ref.current?.getBoundingClientRect()!;

            const offset = e.x - rect.left - 2;
            const maxOffset = rect.width - minWidth;
            const minOffset = rect.width - maxWidth;
            setOffset(
                offset < minOffset
                    ? minOffset
                    : offset > maxOffset
                    ? maxOffset
                    : offset
            );
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isMouseDown, maxWidth, minWidth]);

    useEffect(() => {
        if (!isMouseDown) return;

        const handleMouseClick = () => {
            setIsMouseDown(false);

            var rect = ref.current?.getBoundingClientRect()!;

            setWidth(rect.width - offset);
            setOffset(0);
        };

        document.addEventListener('mouseup', handleMouseClick);

        return () => {
            document.removeEventListener('mouseup', handleMouseClick);
        };
    }, [isMouseDown, offset]);

    return (
        <div
            ref={ref}
            className={`relative h-full ${className} ${
                !isMouseDown && 'transition-all'
            }`}
            style={{ width: `${width}px` }}
        >
            <div
                onMouseDown={handleMouseDown}
                className={`absolute w-[4px] h-full top-0 cursor-w-resize hover:bg-[#0D6EFD] ${clsx(
                    {
                        'transition-all': !isMouseDown,
                        'bg-[#0D6EFD] before:absolute before:w-4 before:h-full before:top-0 before:-left-2 before:cursor-w-resize before:opacity-0':
                            isMouseDown,
                    }
                )}`}
                style={{ left: `${offset}px` }}
            ></div>
            {children}
        </div>
    );
}

export default ResizeContainer;
