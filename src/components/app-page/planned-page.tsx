'use client';

import useStore from '@/lib/stores/index.store';
import AppTitle from '../ui/task/app-title';
import {
    defaultCreateTaskFormValue,
    ListViewCreateTask,
} from '../ui/task/create-task';
import { useLayoutEffect, useMemo, useState } from 'react';
import { fetcher } from '@/lib/http';
import { z } from 'zod';
import { TaskSchema } from '@/lib/zod.schema';
import {
    TasksCompletedTskList,
    TasksNotCompletedList,
} from '../ui/task/list-container';

export const usePlannedTask = () => {
    const setList = useStore((s) => s.setList);
    const [state, setState] = useState({
        isLoading: true,
        isNotFound: false,
    });

    useLayoutEffect(() => {
        fetcher.get('/v1/api/tasks/planned').then(async ([res]) => {
            if (!res?.ok) return;

            const data = (await res?.json()).data;

            const parse = z
                .object({ tasks: z.array(TaskSchema) })
                .safeParse(data);

            if (parse.success) {
                setList(parse.data);
            }
        });

        setState({
            isLoading: false,
            isNotFound: false,
        });

        return () => {
            setList(null);
        };
    }, [setList]);

    return state;
};

export const PlannedPage = () => {
    const tasks = useStore((state) => state.tasks);
    const { isLoading } = usePlannedTask();

    const plannedTask = useMemo(
        () => tasks.filter((task) => task.dueDate),
        [tasks]
    );

    return isLoading ? null : (
        <>
            <header className="flex items-center justify-between w-full h-14 px-3"></header>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <AppTitle name="Planned" />
                    <div className="flex flex-col w-full flex-grow">
                        <div className="">
                            <ListViewCreateTask
                                defaultValue={{
                                    ...defaultCreateTaskFormValue,
                                    important: true,
                                }}
                            />
                        </div>
                        <div className="w-full flex-grow relative">
                            <TasksNotCompletedList tasks={plannedTask} />
                            <TasksCompletedTskList tasks={plannedTask} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
