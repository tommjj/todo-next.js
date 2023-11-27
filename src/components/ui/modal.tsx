'use client';

import { useRouter } from 'next/navigation';
import { MouseEventHandler, useCallback, useEffect, useRef } from 'react';

function Modal({ children }: { children: React.ReactNode }) {
    const overLay = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);

    const onClick: MouseEventHandler = useCallback(
        (e) => {
            if (e.target === overLay.current) {
                onDismiss();
            }
        },
        [onDismiss]
    );

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onDismiss();
        },
        [onDismiss]
    );

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    return (
        <div
            ref={overLay}
            className="fixed z-[999] backdrop-blur-xl flex top-0 left-0 overflow-hidden w-screen h-screen justify-center items-center touch-none"
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default Modal;
