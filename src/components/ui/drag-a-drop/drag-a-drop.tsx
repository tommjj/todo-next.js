'use client';

import { calculateOverlapArea, createDebounce } from '@/lib/utils';
import {
    Dispatch,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

//----====TYPE====----\\

const DndContext = createContext<{
    state: ContextState;
    setState: Dispatch<SetStateAction<ContextState>>;
    addDragItem: (id: string, ref: React.RefObject<HTMLBaseElement>) => void;
    getItemById: (id: string) => HTMLBaseElement | undefined | null;
    getDraggingItem: () => HTMLBaseElement | null;
    removeDragItem: (is: string) => void;
    setDragging: (item: DndItem | null) => void;
} | null>(null);

type DndItem = {
    id: string;
    ref: React.RefObject<HTMLBaseElement>;
};

type ContextState = {
    dragging: React.MutableRefObject<DndItem | null>;
    dragItems: React.MutableRefObject<DndItem[]>;
    dropItems: DndItem[];
};

//----====PROVIDER====----\\

export const DNDProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<ContextState>({
        dragging: useRef<DndItem | null>(null),
        dragItems: useRef<DndItem[]>([]),
        dropItems: [],
    });

    const addDragItem = useCallback(
        (id: string, ref: React.RefObject<HTMLBaseElement>) => {
            state.dragItems.current = [...state.dragItems.current, { id, ref }];
        },
        [state.dragItems]
    );

    const removeDragItem = useCallback(
        (id: string) => {
            state.dragItems.current = [
                ...state.dragItems.current.filter((e) => e.id !== id),
            ];
        },
        [state.dragItems]
    );

    const setDragging = useCallback(
        (item: DndItem | null) => {
            state.dragging.current = item;
        },
        [state.dragging]
    );

    const getItemById = useCallback(
        (id: String) => {
            const item = state.dragItems.current.find((e) => e.id === id);
            return item?.ref.current;
        },
        [state.dragItems]
    );

    const getDraggingItem = useCallback(() => {
        return state.dragging.current?.ref.current || null;
    }, [state.dragging]);

    return (
        <DndContext.Provider
            value={{
                state,
                setState,
                addDragItem,
                removeDragItem,
                setDragging,
                getItemById,
                getDraggingItem,
            }}
        >
            {children}
        </DndContext.Provider>
    );
};

export const DnDContainer = ({ children }: { children: React.ReactNode }) => {
    const over = useRef<DndItem | null>(null);
    const {
        state: { dragging, dragItems },
    } = useContext(DndContext)!;

    useEffect(() => {
        const handleMove = () => {
            if (!dragging.current?.ref.current) return;

            const draggingRect =
                dragging.current.ref.current.getBoundingClientRect();

            let max = 0;
            const overElement = dragItems.current.reduce<DndItem | undefined>(
                (elem, item) => {
                    if (item.id === dragging.current?.id) return elem;
                    const ref = item.ref;

                    if (ref.current) {
                        const rect = ref.current.getBoundingClientRect();

                        const area = calculateOverlapArea(draggingRect, rect);
                        if (max < area) {
                            max = area;
                            return item;
                        }
                    }
                    return elem;
                },
                undefined
            );
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('id', dragging.current.id);

            if (overElement?.id) {
                if (over.current?.id !== overElement.id) {
                    over.current?.ref.current?.dispatchEvent(
                        new DragEvent('dragleave', {
                            bubbles: true,
                            dataTransfer: dataTransfer,
                        })
                    );
                    overElement.ref.current?.dispatchEvent(
                        new DragEvent('dragenter', {
                            bubbles: true,
                            dataTransfer: dataTransfer,
                        })
                    );
                    over.current = overElement;
                }

                overElement.ref.current?.dispatchEvent(
                    new DragEvent('dragover', {
                        bubbles: true,
                        dataTransfer: dataTransfer,
                    })
                );
            } else {
                over.current?.ref.current?.dispatchEvent(
                    new DragEvent('dragleave', {
                        bubbles: true,
                        dataTransfer: dataTransfer,
                    })
                );
                over.current = null;
            }
        };

        const handleMouseUp = () => {
            if (over.current?.ref && dragging.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.setData('id', dragging.current.id);

                over.current.ref.current?.dispatchEvent(
                    new DragEvent('dragend', {
                        bubbles: true,
                        dataTransfer: dataTransfer,
                    })
                );
                over.current = null;
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchend', handleMouseUp);
        document.addEventListener('touchmove', handleMove);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMove);

            document.removeEventListener('touchend', handleMouseUp);
            document.removeEventListener('touchmove', handleMove);
        };
    }, [dragItems, dragging]);

    return <>{children}</>;
};

//----====HOOK====----\\

export const useDndDrag = (props: { id: string; delay?: number }) => {
    const ref = useRef<HTMLBaseElement>(null);
    const { addDragItem, removeDragItem, setDragging } =
        useContext(DndContext)!;

    const [state, setState] = useState({
        isDrag: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        translateX: 0,
        translateY: 0,
    });

    useEffect(() => {
        addDragItem(props.id, ref);

        return () => {
            removeDragItem(props.id);
        };
    }, [addDragItem, removeDragItem, props]);

    useEffect(() => {
        if (!ref.current || state.isDrag) return;
        const element = ref.current;

        const handle = (clientX: number, clientY: number) => {
            const rect = ref.current?.getBoundingClientRect()!;

            window?.getSelection()?.removeAllRanges();
            setDragging({ id: props.id, ref });
            setState({
                isDrag: true,
                startX: clientX - rect.x,
                startY: clientY - rect.y,
                currentX: clientX,
                currentY: clientY,
                translateX: 0,
                translateY: 0,
            });
        };

        const deb = createDebounce(handle, props.delay || 0);

        const handleClear = () => {
            deb.clear();
        };

        const handleMouseDown = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            deb.func(x, y);

            if (props.delay) {
                const handleClearTimeout = (e: MouseEvent) => {
                    const edge1 = e.clientX - x;
                    const edge2 = e.clientY - y;
                    if (Math.sqrt(edge1 * edge1 + edge2 * edge2) > 12) {
                        deb.clear();
                    }
                };

                element.addEventListener('mouseup', handleClear);

                document.addEventListener('mousemove', handleClearTimeout);
                setTimeout(() => {
                    document.removeEventListener(
                        'mousemove',
                        handleClearTimeout
                    );
                    element.removeEventListener('mouseup', handleClear);
                }, props.delay);
            }
        };
        const handleTouchStart = (e: TouchEvent) => {
            const x = e.changedTouches[0].clientX;
            const y = e.changedTouches[0].clientY;
            deb.func(x, y);

            if (props.delay) {
                const handleClearTimeout = (e: TouchEvent) => {
                    const edge1 = e.changedTouches[0].clientX - x;
                    const edge2 = e.changedTouches[0].clientY - y;
                    if (Math.sqrt(edge1 * edge1 + edge2 * edge2) > 12) {
                        deb.clear();
                    }
                };

                document.addEventListener('touchmove', handleClearTimeout);
                element.addEventListener('touchend', handleClear);
                setTimeout(() => {
                    document.removeEventListener(
                        'touchmove',
                        handleClearTimeout
                    );
                    element.removeEventListener('touchend', handleClear);
                }, props.delay);
            }
        };

        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('touchstart', handleTouchStart);

        return () => {
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('touchstart', handleTouchStart);
        };
    }, [props, setDragging, state.isDrag]);

    useEffect(() => {
        if (!state.isDrag) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = ref.current?.getBoundingClientRect()!;
            var matrix = new WebKitCSSMatrix(ref.current?.style.transform);

            window?.getSelection()?.removeAllRanges();
            setState({
                isDrag: true,
                currentX: e.clientX,
                currentY: e.clientY,
                startX: state.startX,
                startY: state.startY,
                translateX: e.clientX - (state.startX + (rect.x - matrix.m41)),
                translateY: e.clientY - (state.startY + (rect.y - matrix.m42)),
            });
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const rect = ref.current?.getBoundingClientRect()!;
            var matrix = new WebKitCSSMatrix(ref.current?.style.transform);

            window?.getSelection()?.removeAllRanges();
            setState({
                isDrag: true,
                currentX: e.changedTouches[0].clientX,
                currentY: e.changedTouches[0].clientY,
                startX: state.startX,
                startY: state.startY,
                translateX:
                    e.changedTouches[0].clientX -
                    (state.startX + (rect.x - matrix.m41)),
                translateY:
                    e.changedTouches[0].clientY -
                    (state.startY + (rect.y - matrix.m42)),
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, [state.isDrag, state.startX, state.startY]);

    useEffect(() => {
        if (!ref.current || !state.isDrag) return;

        const handleUp = () => {
            setState((priv) => ({
                ...priv,
                isDrag: false,
            }));
            setDragging(null);
        };

        document.addEventListener('touchend', handleUp);
        document.addEventListener('mouseup', handleUp);

        return () => {
            document.removeEventListener('touchend', handleUp);
            document.removeEventListener('mouseup', handleUp);
        };
    }, [setDragging, state.isDrag]);

    return { ...state, ref };
};

export const useDndMethods = () => {
    const { getItemById, getDraggingItem } = useContext(DndContext)!;
    return { getItemById, getDraggingItem };
};
