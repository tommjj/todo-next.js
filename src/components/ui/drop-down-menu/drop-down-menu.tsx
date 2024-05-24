'use client';

import clsx from 'clsx';
import React, {
    createContext,
    MouseEventHandler,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';

const DDMContext = createContext<
    | {
          triggerRef: React.RefObject<HTMLDivElement>;
          contentRef: React.RefObject<HTMLDivElement>;
          isOpen: boolean;
          close: () => void;
          open: () => void;
      }
    | undefined
>(undefined);

const useDDMContext = () => {
    const context = useContext(DDMContext);

    if (!context) throw new Error('drop down menu context');

    return context;
};

export type DropdownMenuProps = {
    children: React.ReactNode;
    priorityDir?: 'Left' | 'Right';
    onOpen?: () => void;
    onClose?: () => void;
};

export type DropdownMenuRef = {
    isOpen: boolean;
    handleOpen: () => void;
    handleClose: () => void;
};

export const DropdownMenu = forwardRef<DropdownMenuRef, DropdownMenuProps>(
    function DropdownMenu(
        {
            children,
            priorityDir = 'Left',
            onOpen = () => {},
            onClose = () => {},
        },
        ref
    ) {
        const triggerRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const [isOpen, setIsOpen] = useState(false);

        const handleOpen = useCallback(() => {
            setIsOpen(true);
            onOpen();
        }, [onOpen]);

        const handleClose = useCallback(() => {
            setIsOpen(false);
            onClose();
        }, [onClose]);

        useImperativeHandle(
            ref,
            () => ({
                isOpen: isOpen,
                handleOpen: handleOpen,
                handleClose: handleClose,
            }),
            [handleClose, handleOpen, isOpen]
        );

        useEffect(() => {
            if (!isOpen) return;

            const contentElement = contentRef.current;

            const triggerElement = triggerRef.current;

            if (!contentElement || !triggerElement) return;

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
                      (contentBoundingRect.width - triggerBoundingRect.width) /
                          2 <
                  20;

            const isOverRight = isOverOverflow
                ? triggerBoundingRect.right + contentBoundingRect.width >
                  window.innerWidth
                : triggerBoundingRect.right +
                      (contentBoundingRect.width - triggerBoundingRect.width) /
                          2 >
                  window.innerWidth;

            contentElement.style.cssText = `display: block; opacity: 1; ${clsx({
                [`bottom: ${window.innerHeight - triggerBoundingRect.top}px;`]:
                    isOnTop,
                [`top: ${triggerBoundingRect.bottom}px;`]: isOnBottom,
                'top: 10px;': isOverOverflow,
                [`left: ${
                    isOverOverflow
                        ? triggerBoundingRect.right
                        : triggerBoundingRect.left > 10
                        ? 10
                        : triggerBoundingRect.left
                }px;`]:
                    isOverLeft ||
                    (!isOverRight && isOverOverflow && priorityDir === 'Right'),
                [`right: ${
                    isOverOverflow
                        ? window.innerWidth - triggerBoundingRect.left
                        : window.innerWidth - triggerBoundingRect.right > 10
                        ? 15
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

            function preventScroll(e: WheelEvent) {
                const ele = e.target;
                const content = contentRef.current;
                if (!ele || !content) return;

                if (!content.contains(ele as Node)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
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

        return (
            <DDMContext.Provider
                value={{
                    triggerRef,
                    contentRef,
                    isOpen,
                    close: handleClose,
                    open: handleOpen,
                }}
            >
                {children}
            </DDMContext.Provider>
        );
    }
);

export function DropdownMenuTrigger({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { triggerRef, open } = useDDMContext();

    const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            open();
        },
        [open]
    );

    return (
        <div ref={triggerRef} onClick={handleClick} className={className}>
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
    const { contentRef } = useDDMContext();

    return (
        document.body &&
        createPortal(
            <div
                ref={contentRef}
                className={`hidden fixed z-[999] rounded-md border bg-[#FAFAFA] dark:bg-[#18181B] ${className} pointer-events-auto transition-none`}
            >
                {children}
            </div>,
            document.body
        )
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
