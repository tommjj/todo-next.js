'use client';

import useStore from '@/lib/stores/index.store';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { DetailEditorTask } from './detail-editor';
import { SubtaskView } from './detail-subtask';
import Comment from './detail-comment';

export const NotFound = () => {
    return <div className="w-full h-full">404</div>;
};

export const DetailTaskView = (props: { taskId?: string }) => {
    const [taskId, setTaskId] = useState(props.taskId);
    const tasks = useStore((state) => state.tasks);

    const task = useMemo(() => {
        return tasks.find((e) => e.id === taskId);
    }, [taskId, tasks]);

    useLayoutEffect(() => {
        if (props.taskId) {
            setTaskId(props.taskId);
        }
    }, [props.taskId]);

    return !task ? (
        <NotFound />
    ) : (
        <div className="w-full flex-grow overflow-y-auto custom-scrollbar px-[6px] pb-[6px]">
            <div className="bg-main-bg-color dark:bg-main-bg-color-dark rounded-md min-h-full">
                <DetailEditorTask task={task} key={taskId} />
                <SubtaskView task={task} key={`sub::${taskId}`} />
                <Comment taskId={task.id} />
            </div>
        </div>
    );
};
