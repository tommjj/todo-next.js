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
import { Header } from '../ui/header/main-header';

export const useImportantTask = () => {
    const setList = useStore((s) => s.setList);
    const [state, setState] = useState({
        isLoading: true,
        isNotFound: false,
    });

    useLayoutEffect(() => {
        fetcher.get('/v1/api/tasks/important').then(async ([res]) => {
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

export const ImportantPage = () => {
    const tasks = useStore((state) => state.tasks);
    const { isLoading } = useImportantTask();

    const importantTask = useMemo(
        () => tasks.filter((task) => task.important),
        [tasks]
    );

    return isLoading ? null : (
        <>
            <Header listTitle="Important" />
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <AppTitle name="Important" />
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
                            <TasksNotCompletedList tasks={importantTask} />
                            <TasksCompletedTskList tasks={importantTask} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
