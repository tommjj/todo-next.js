'use client';

import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const useDropdownMenu = ({
    priorityDir = 'Left',
}: {
    priorityDir?: 'Left' | 'Right';
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleToggle = useCallback(() => {
        setIsOpen((privState) => !privState);
    }, []);

    useEffect(() => {
        if (!ref.current || !isOpen) return;

        const contentElement = ref.current.querySelector(
            '#DropdownMenuContent'
        ) as HTMLElement;
        const triggerElement = ref.current?.querySelector(
            '#DropdownMenuTrigger'
        ) as HTMLElement;

        if (!contentElement && !triggerElement) return;

        contentElement.style.cssText = 'display: block; opacity: 0;';

        const contentBoundingRect = contentElement.getBoundingClientRect();
        const triggerBoundingRect = triggerElement.getBoundingClientRect();

        const isOnBottom =
            triggerBoundingRect.bottom + contentBoundingRect.height <
            window.innerHeight;

        const isOnTop = isOnBottom
            ? false
            : triggerBoundingRect.top - contentBoundingRect.height > 0;

        const isOverOverflow = !(isOnTop || isOnBottom);

        const isOverLeft = isOverOverflow
            ? triggerBoundingRect.x - contentBoundingRect.width < 20
            : triggerBoundingRect.x -
                  (contentBoundingRect.width - triggerBoundingRect.width) / 2 <
              20;

        const isOverRight = isOverOverflow
            ? triggerBoundingRect.right + contentBoundingRect.width >
              window.innerWidth
            : triggerBoundingRect.right +
                  (contentBoundingRect.width - triggerBoundingRect.width) / 2 >
              window.innerWidth;

        contentElement.style.cssText = `display: block; opacity: 1; ${clsx({
            [`bottom: ${window.innerHeight - triggerBoundingRect.top}px;`]:
                isOnTop,
            [`top: ${triggerBoundingRect.bottom}px;`]: isOnBottom,
            'top: 10px;': isOverOverflow,
            [`left: ${
                isOverOverflow
                    ? triggerBoundingRect.right
                    : triggerBoundingRect.left
            }px;`]:
                isOverLeft ||
                (!isOverRight && isOverOverflow && priorityDir === 'Right'),
            [`right: ${
                isOverOverflow
                    ? window.innerWidth - triggerBoundingRect.left
                    : window.innerWidth - triggerBoundingRect.right
            }px`]:
                isOverRight ||
                (!isOverLeft && isOverOverflow && priorityDir === 'Left'),
            [`left: ${
                triggerBoundingRect.x + triggerBoundingRect.width / 2
            }px; transform: translateX(-50%);`]: isOverOverflow
                ? isOverLeft && isOverRight
                : !(isOverLeft || isOverRight),
        })} 
        `;

        document.body.style.cssText = `pointer-events: none; touch-action: none;`;

        return () => {
            contentElement.style.cssText = '';
            document.body.style.cssText = '';
        };
    }, [isOpen, priorityDir]);

    useEffect(() => {
        if (!isOpen) return;

        function preventScroll(e: any) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        const handleClick = (e: MouseEvent) => {
            document.body.style.cssText = '';
            handleClose();
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('wheel', preventScroll, {
            passive: false,
        });

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('wheel', preventScroll);
        };
    }, [isOpen, handleClose]);

    return {
        isOpen,
        handleClose,
        handleOpen,
        handleToggle,
        ref,
    };
};

export function DropdownMenu({
    children,
    priorityDir = 'Left',
}: {
    children: React.ReactNode;
    priorityDir?: 'Left' | 'Right';
}) {
    const { ref, handleToggle } = useDropdownMenu({ priorityDir });

    useEffect(() => {
        const triggerElement = ref.current?.querySelector(
            '#DropdownMenuTrigger'
        ) as HTMLElement;

        if (!triggerElement) return;

        triggerElement.onclick = (e) => {
            e.stopPropagation();

            handleToggle();
            return false;
        };
    }, [ref, handleToggle]);

    return (
        <div className="relative w-fit " ref={ref}>
            {children}
        </div>
    );
}

export function DropdownMenuTrigger({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div id="DropdownMenuTrigger" className={className}>
            {children}
        </div>
    );
}

export function DropdownMenuContent({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`hidden fixed z-[999] rounded-md border bg-[#FAFAFA] dark:bg-[#18181B] ${className} pointer-events-auto transition-none`}
            id="DropdownMenuContent"
        >
            {children}
        </div>
    );
}

export function DropdownMenuItem({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className} style={{ pointerEvents: 'auto' }}>
            {children}
        </div>
    );
}

export function DropdownMenuLabel() {}
