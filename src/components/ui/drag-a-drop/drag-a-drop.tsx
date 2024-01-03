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
    removeDragItem: (is: string) => void;
    setDragging: (item: DndItem | null) => void;
} | null>(null);

type DndItem = {
    id: string;
    ref: React.RefObject<HTMLBaseElement>;
};

type ContextState = {
    dragging: React.MutableRefObject<DndItem | null>;
    dragItems: DndItem[];
    dropItems: DndItem[];
};

//----====PROVIDER====----\\

export const DNDProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<ContextState>({
        dragging: useRef<DndItem | null>(null),
        dragItems: [],
        dropItems: [],
    });

    const addDragItem = useCallback(
        (id: string, ref: React.RefObject<HTMLBaseElement>) => {
            setState((priv) => ({
                ...priv,
                dragItems: [...priv.dragItems, { id, ref }],
            }));
        },
        []
    );

    const removeDragItem = useCallback((id: string) => {
        setState((priv) => ({
            ...priv,
            dragItems: [...priv.dragItems.filter((i) => i.id !== id)],
        }));
    }, []);

    const setDragging = useCallback(
        (item: DndItem | null) => {
            state.dragging.current = item;
        },
        [state.dragging]
    );

    return (
        <DndContext.Provider
            value={{
                state,
                setState,
                addDragItem,
                removeDragItem,
                setDragging,
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
        const handleMove = (e: MouseEvent) => {
            if (!dragging.current?.ref.current) return;

            const draggingRect =
                dragging.current.ref.current.getBoundingClientRect();

            let max = 0;
            const overElement = dragItems.reduce<DndItem | undefined>(
                (elem, item) => {
                    if (item.id === dragging.current?.id) return elem;
                    const ref = item.ref;
                    if (ref.current) {
                        const rect = ref.current?.getBoundingClientRect();

                        const area = calculateOverlapArea(draggingRect!, rect);
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
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);

            document.removeEventListener('mousemove', handleMove);
        };
    }, [dragItems, dragging]);

    return <>{children}</>;
};

export const useDrag = (props: { id: string; delay?: number }) => {
    const ref = useRef<HTMLBaseElement>(null);
    const { addDragItem, removeDragItem, setDragging } =
        useContext(DndContext)!;

    const [state, setState] = useState({
        isMouseDown: false,
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
    }, [addDragItem, removeDragItem, props.id]);

    useEffect(() => {
        if (!ref.current || state.isMouseDown) return;
        const element = ref.current;

        const handle = (clientX: number, clientY: number) => {
            window?.getSelection()?.removeAllRanges();
            setDragging({ id: props.id, ref });
            setState({
                isMouseDown: true,
                startX: clientX,
                startY: clientY,
                currentX: clientX,
                currentY: clientY,
                translateX: 0,
                translateY: 0,
            });
        };

        const deb = createDebounce(handle, props.delay || 0);

        const handleMouseDown = (e: MouseEvent) => {
            deb.func(e.clientX, e.clientY);
        };
        const handleTouchStart = (e: TouchEvent) => {
            deb.func(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        };
        const handleClear = () => {
            deb.clear();
        };

        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('mouseup', handleClear);
        element.addEventListener('mouseleave', handleClear);
        element.addEventListener('touchend', handleClear);

        return () => {
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('mouseup', handleClear);
            element.removeEventListener('mouseleave', handleClear);
            element.removeEventListener('touchend', handleClear);
        };
    }, [props, setDragging, state.isMouseDown]);

    useEffect(() => {
        if (!state.isMouseDown) return;
        const handleMouseMove = (e: MouseEvent) => {
            window?.getSelection()?.removeAllRanges();
            setState({
                isMouseDown: true,
                currentX: e.clientX,
                currentY: e.clientY,
                startX: state.startX,
                startY: state.startY,
                translateX: e.clientX - state.startX,
                translateY: e.clientY - state.startY,
            });
        };

        const handleTouchMove = (e: TouchEvent) => {
            window?.getSelection()?.removeAllRanges();
            setState({
                isMouseDown: true,
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
    }, [state.isMouseDown, state.startX, state.startY]);

    useEffect(() => {
        if (!ref.current || !state.isMouseDown) return;

        const handleUp = () => {
            setState((priv) => ({
                ...priv,
                isMouseDown: false,
            }));
            setDragging(null);
        };

        document.addEventListener('touchend', handleUp);
        document.addEventListener('mouseup', handleUp);

        return () => {
            document.removeEventListener('touchend', handleUp);
            document.removeEventListener('mouseup', handleUp);
        };
    }, [setDragging, state.isMouseDown]);

    return { ...state, ref };
};
