import { calculateOverlapArea } from '@/lib/utils';
import {
    Dispatch,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useEffect,
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
    dragging: DndItem | null;
    dragItems: DndItem[];
    dropItems: DndItem[];
};

//----====PROVIDER====----\\

export const DNDProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<ContextState>({
        dragging: null,
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

    const setDragging = useCallback((item: DndItem | null) => {
        setState((priv) => ({
            ...priv,
            dragging: item,
        }));
    }, []);

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
    const {
        state: { dragging, dragItems },
    } = useContext(DndContext)!;

    useEffect(() => {
        if (!dragging) return;
        const handleMove = (e: MouseEvent) => {
            const draggingRect = dragging?.ref.current?.getBoundingClientRect();

            let max = 0;
            const overElement = dragItems.reduce<DndItem | undefined>(
                (elem, item) => {
                    if (item.id === dragging.id) return elem;
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

            if (overElement?.id) {
                const dataTransfer = new DataTransfer();
                dataTransfer.setData('id', overElement.id);

                overElement.ref.current?.dispatchEvent(
                    new DragEvent('dragover', {
                        bubbles: true,
                        dataTransfer: dataTransfer,
                    })
                );
            }
        };

        document.addEventListener('mousemove', handleMove);
        return () => {
            document.removeEventListener('mousemove', handleMove);
        };
    }, [dragging, dragItems]);

    return <>{children}</>;
};

export const useDrag = (props: { id: string }) => {
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

        const handle = () => {
            window?.getSelection()?.removeAllRanges();
            setDragging({ id: props.id, ref });
        };

        const handleMouseDown = (e: MouseEvent) => {
            handle();
            setState({
                isMouseDown: true,
                startX: e.clientX,
                startY: e.clientY,
                currentX: e.clientX,
                currentY: e.clientY,
                translateX: 0,
                translateY: 0,
            });
        };
        const handleTouchStart = (e: TouchEvent) => {
            handle();
            setState({
                isMouseDown: true,
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
