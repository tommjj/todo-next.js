'use client';

import React, { useEffect, useRef, useState } from 'react';

export function DropdownMenu({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        const childNodes = ref.current?.childNodes;

        if (!childNodes) return;

        (Object.values(childNodes) as HTMLElement[]).forEach((item) => {
            if (item.id === 'DropdownMenuContent') {
                if (openMenu) {
                    item.style.cssText = `display: block; left: 50%; transform: translateX(-50%);`;

                    const BoundingClientRect = item.getBoundingClientRect();
                    const isOnTop =
                        BoundingClientRect.y + BoundingClientRect.height >
                        window.innerHeight;

                    const isLeft = BoundingClientRect.x < 0;
                    const isRight =
                        BoundingClientRect.x + BoundingClientRect.width >
                        window.innerWidth;

                    item.style.cssText = `display: block; ${
                        isOnTop ? `bottom: 100%;` : 'top: 100%;'
                    } ${isLeft ? 'left: 0;' : ''} ${
                        isRight ? 'right: 0;' : ''
                    } ${
                        isLeft ||
                        isRight ||
                        `left: 50%; transform: translateX(-50%);`
                    }`;
                    document.body.style.cssText = `pointer-events: none; touch-action: none;`;
                } else {
                    item.style.cssText = '';
                    document.body.style.cssText = 'pointer-events: auto;';
                }
            }
            if (item.id === 'DropdownMenuTrigger') {
                item.onclick = (e: any) => {
                    e.stopPropagation();
                    setOpenMenu(!openMenu);
                };
            }
        });
    }, [openMenu]);

    useEffect(() => {
        function preventScroll(e: any) {
            e.preventDefault();
            e.stopPropagation();

            return false;
        }

        const handleClick = (e: MouseEvent) => {
            document.body.style.cssText = '';
            setOpenMenu(false);
        };

        if (openMenu) {
            window.addEventListener('wheel', preventScroll, {
                passive: false,
            });

            window.addEventListener('click', handleClick);

            return () => {
                window.addEventListener('click', handleClick);
                window.removeEventListener('wheel', preventScroll);
            };
        }
    }, [openMenu]);

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
            className={`hidden absolute z-[999] rounded-md border bg-[#FAFAFA] dark:bg-[#18181B] ${className}`}
            id="DropdownMenuContent"
            style={{ pointerEvents: 'auto' }}
        >
            {children}
        </div>
    );
}

export function DropdownMenuItem({ children }: { children: React.ReactNode }) {
    return <div style={{ pointerEvents: 'auto' }}>{children}</div>;
}

export function DropdownMenuLabel() {}
