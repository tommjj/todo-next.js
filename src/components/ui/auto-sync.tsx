'use client';

import useStore from '@/lib/stores/index.store';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useFetch } from '../hook';
import { ShareDataType } from '@/lib/zod.schema';

const AutoSyncContext = createContext<
    { tick: number; handleSync: () => void; isAutoSync: boolean } | undefined
>(undefined);

export type ShareData = {
    data: ShareDataType;
};

export const useAutoSyncContext = () => {
    const state = useContext(AutoSyncContext);
    if (!state) throw new Error('AutoSyncContext');

    return state;
};

export const AutoSyncProvider = ({
    autoSync = false,
    intervalTime = 30,
    children,
}: {
    autoSync?: boolean;
    intervalTime?: number;
    children?: React.ReactNode;
}) => {
    const [auto, setAuto] = useState(false);
    const currentList = useStore((s) => s.currentList);
    const [time, setTime] = useState(0);
    const ref = useRef(0);
    const refreshCurrentList = useStore((s) => s.refreshCurrentList);

    const { data } = useFetch<ShareData>(
        `/v1/api/share/lists/${currentList?.id}`
    );

    useEffect(() => {
        if (!autoSync) return;
        if (!data) return;
        if (data.data.Share.length === 0) return;

        setAuto(true);

        const id = setInterval(() => {
            if (ref.current < intervalTime) {
                setTime(++ref.current);
            } else {
                refreshCurrentList();
                ref.current = 0;
                setTime(ref.current);
            }
        }, 1000);

        return () => {
            clearInterval(id);
        };
    }, [autoSync, data, intervalTime, refreshCurrentList]);

    const handleSync = useCallback(() => {
        refreshCurrentList();
        ref.current = 0;
        setTime(ref.current);
    }, [refreshCurrentList]);

    return (
        <AutoSyncContext.Provider
            value={{ handleSync, tick: time, isAutoSync: auto }}
        >
            {children}
        </AutoSyncContext.Provider>
    );
};
