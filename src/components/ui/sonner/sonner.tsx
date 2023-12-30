'use client';

import {
    CSSProperties,
    MouseEventHandler,
    useCallback,
    useEffect,
    useState,
} from 'react';
import Button, { Variant } from '../button';
import clsx from 'clsx';

type Toast = {
    title: string;
    description?: string;
    action?: {
        variant?: Variant;
        label: string;
        onClick: MouseEventHandler;
    };
    callBack?: () => void;
};

type ToastWithId = {
    id: number;
    toast: Toast;
};

export function toast(toast: Toast) {
    const eventCreateToast = new CustomEvent('create toast', {
        bubbles: true,
        detail: toast,
    });

    document.dispatchEvent(eventCreateToast);
}

//----====Toast Item====----\\

export function ToastItem({
    toast: { id, toast },
    index,
    remove,
    open = false,
}: {
    open?: boolean;
    toast: ToastWithId;
    index: number;
    remove: (id: number) => void;
}) {
    const [state, setState] = useState({
        isMouseDown: false,
        y: 0,
        currentY: 0,
    });

    const handleMouseDown: MouseEventHandler = useCallback((e) => {
        const newState = { isMouseDown: true, y: e.clientY, currentY: 0 };
        setState(newState);
    }, []);

    const translate = state.isMouseDown
        ? ({
              top: `${
                  state.currentY - state.y < 0 ? 0 : state.currentY - state.y
              }px`,
          } satisfies CSSProperties)
        : {};

    useEffect(() => {
        return () => {
            toast.callBack && toast.callBack();
        };
    }, [toast]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (state.isMouseDown) {
                setState({
                    isMouseDown: true,
                    currentY: e.clientY,
                    y: state.y,
                });
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [state.isMouseDown, state.y]);

    useEffect(() => {
        const handleMouseClick = () => {
            if (state.currentY - state.y > 18) {
                remove(id);
            }
            setState({
                isMouseDown: false,
                y: 0,
                currentY: 0,
            });
        };

        document.addEventListener('click', handleMouseClick);

        return () => {
            document.removeEventListener('click', handleMouseClick);
        };
    }, [id, remove, state.currentY, state.y]);

    const handleClickAction = (
        action: MouseEventHandler
    ): MouseEventHandler => {
        return (e) => {
            action(e);
            remove(id);
        };
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            style={translate}
            className={`relative w-full sm:w-[22rem] animate-up select-none ${clsx(
                {
                    'h-3 group-hover:h-16 group-hover:mt-2': index < 2,
                    'opacity-0 h-0 overflow-hidden': index > 2,
                    'transition-all duration-300': !state.isMouseDown,
                    'h-16 mt-2 ': open && index < 3,
                }
            )} `}
        >
            <div
                className={`absolute bottom-0 left-0 w-full sm:w-[22rem] p-3 border rounded-md  text-[13px] bg-white dark:bg-[#111] shadow-lg transition-all duration-300 ${clsx(
                    {
                        'scale-95  group-hover:scale-100 ': index === 1,
                        'scale-90 group-hover:scale-100': index === 2,
                        'scale-100': open && index < 3,
                    }
                )}`}
            >
                <div
                    className={`flex transition-all duration-300 ${clsx({
                        'opacity-0 group-hover:opacity-100':
                            index === 1 || index === 2,
                        'opacity-100': open && index < 3,
                    })}`}
                >
                    <div className=" text-[#333] dark:text-white flex-grow h-9">
                        <div className="font-semibold">{toast.title}</div>
                        <div>{toast.description}</div>
                    </div>
                    <div className="flex justify-center items-center ml-2">
                        {toast.action && (
                            <Button
                                className="text-xs"
                                variant={toast.action.variant || 'dark'}
                                onClick={handleClickAction(
                                    toast.action.onClick
                                )}
                            >
                                {toast.action.label}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Toaster() {
    const [toasts, setToasts] = useState<ToastWithId[]>([]);
    const [startClose, setStartClose] = useState(true);
    const [open, setIsOpen] = useState({ isEnter: false, isMouseDown: false });

    const onEnter = useCallback(() => {
        setIsOpen((priv) => ({ ...priv, isEnter: true }));
    }, []);
    const onLeave = useCallback(() => {
        setIsOpen((priv) => ({ ...priv, isEnter: false }));
    }, []);

    const onMouseDown = useCallback(() => {
        setIsOpen((priv) => ({ ...priv, isMouseDown: true }));
    }, []);

    const removeToastById = useCallback((id: number) => {
        setToasts((prev) => {
            return [...prev.filter((item) => item.id !== id)];
        });
    }, []);

    useEffect(() => {
        const onClick = () => {
            setIsOpen((priv) => ({ ...priv, isMouseDown: false }));
        };

        document.addEventListener('click', onClick);

        return () => {
            document.removeEventListener('click', onClick);
        };
    }, []);

    useEffect(() => {
        const handleEven = ((e: CustomEvent<Toast>) => {
            setStartClose(false);
            setToasts((priv) => [
                ...priv,
                { id: Date.now(), toast: { ...e.detail } },
            ]);
        }) as EventListener;

        document.addEventListener('create toast', handleEven);

        return () => {
            document.removeEventListener('create toast', handleEven);
        };
    }, []);

    useEffect(() => {
        if (open.isEnter || open.isMouseDown) return;

        const timeoutId = setTimeout(() => {
            setStartClose(true);
            setTimeout(() => {
                setToasts([]);
            }, 300);
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [toasts, open.isEnter, open.isMouseDown]);

    return (
        <div
            onMouseDown={onMouseDown}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className={`group fixed bottom-4 w-screen sm:w-auto p-2 right-0 sm:right-8 z-50 flex flex-col justify-between items-center bg-white transition-all duration-150 ${clsx(
                {
                    hidden: toasts.length === 0,
                    'translate-y-96': startClose,
                    'translate-y-0': !startClose,
                }
            )}`}
        >
            {toasts.map((item, index) => (
                <ToastItem
                    open={open.isMouseDown}
                    key={item.id}
                    remove={removeToastById}
                    toast={item}
                    index={toasts.length - index - 1}
                />
            ))}
        </div>
    );
}
