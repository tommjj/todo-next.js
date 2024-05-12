'use client';

import React, {
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import Button, { Variant } from '../button';
import { cn } from '@/lib/utils';

export type DialogRef = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

const AlertDialog = forwardRef<
    DialogRef,
    { children: React.ReactNode; defaultValue?: boolean }
>(function AlertDialog(props, ref) {
    const [isOpen, setIsOpen] = useState(props.defaultValue ? true : false);

    useImperativeHandle(ref, () => ({ isOpen, setIsOpen }), [isOpen]);

    return (
        <Context.Provider value={[isOpen, setIsOpen]}>
            {props.children}
        </Context.Provider>
    );
});

export function AlertDialogTrigger({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [, setIsOpen] = useContext(Context)!;

    return (
        <div
            className=""
            onClick={(e) => {
                setIsOpen((prevState) => !prevState);
            }}
        >
            {children}
        </div>
    );
}

export function AlertDialogContent({
    children,
    className,
    ContentClassName,
}: {
    children?: React.ReactNode;
    className?: string;
    ContentClassName?: string;
}) {
    const [isOpen, setIsOpen] = useContext(Context)!;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ele = ref.current;
        if (!isOpen) return;
        if (!ele) return;

        function preventScroll(e: any) {
            if (e.target !== ele) return;
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        window.addEventListener('wheel', preventScroll, {
            passive: false,
        });

        return () => {
            window.removeEventListener('wheel', preventScroll);
        };
    }, [isOpen]);

    return (
        <>
            {isOpen
                ? createPortal(
                      <div
                          ref={ref}
                          className={cn(
                              'backdrop-blur-md shadow-md shadow-[#00000040] flex p-4 justify-center items-center fixed w-screen h-screen top-0 left-0 bg-[#11111160] z-[999] animate-loaded',
                              className
                          )}
                          onClick={(e) => {
                              if (ref.current === e.target) setIsOpen(false);
                          }}
                      >
                          <div
                              className={cn(
                                  'w-full md:w-[512px] px-6 py-4 rounded-md bg-white border dark:bg-[#111] animate-open ',
                                  ContentClassName
                              )}
                          >
                              {children}
                          </div>
                      </div>,
                      document.body
                  )
                : null}
        </>
    );
}

export function AlertDialogHeader({
    children,
}: {
    children?: React.ReactNode;
}) {
    return <div>{children}</div>;
}

export function AlertDialogTitle({ children }: { children?: React.ReactNode }) {
    return (
        <p className="font-semibold text-xl text-[#333] dark:text-[#fff]">
            {children}
        </p>
    );
}

export function AlertDialogDescription({
    children,
}: {
    children?: React.ReactNode;
}) {
    return (
        <p className="pt-2 text-[#555] dark:text-[#ccc] font-normal text-base">
            {children}
        </p>
    );
}

export function AlertDialogFooter({
    children,
}: {
    children?: React.ReactNode;
}) {
    return <div className="flex justify-end pt-4">{children}</div>;
}

export function AlertDialogCancel({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [, setIsOpen] = useContext(Context)!;
    return (
        <Button
            onClick={() => {
                setIsOpen(false);
            }}
            variant="outline"
            className="py-1 ml-2 text-[#444] dark:text-[#ddd]"
        >
            {children}
        </Button>
    );
}

export function AlertDialogAction({
    children,
    action,
    asChild = false,
    variant = 'dark',
}: {
    children?: React.ReactNode;
    action?: () => void;
    asChild?: boolean;
    variant?: Variant;
}) {
    const [, setIsOpen] = useContext(Context)!;
    return (
        <>
            {!asChild ? (
                <Button
                    onClick={() => {
                        action && action();
                        setIsOpen(false);
                    }}
                    variant="destructive"
                    className="py-1 ml-2"
                >
                    {children}
                </Button>
            ) : (
                <div
                    className="pl-2 w-fit"
                    onClick={() => {
                        setTimeout(() => {
                            setIsOpen(false);
                        });
                    }}
                >
                    {children}
                </div>
            )}
        </>
    );
}

export default AlertDialog;
