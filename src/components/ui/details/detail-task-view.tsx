'use client';

import useStore from '@/lib/stores/index.store';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

export const DetailTaskView = (props: { taskId?: string }) => {
    const [taskId, setTaskId] = useState(props.taskId);
    const list = useStore((state) => state.list);

    const task = list && list.tasks?.find((e) => e.id === taskId);

    useLayoutEffect(() => {
        if (props.taskId) {
            setTaskId(props.taskId);
        }
    }, [props.taskId]);

    return !task ? (
        <div className="w-full h-full">404</div>
    ) : (
        <div className="w-full h-full">{task.title}</div>
    );
};
