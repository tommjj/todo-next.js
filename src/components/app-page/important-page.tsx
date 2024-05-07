'use client';

import useStore from '@/lib/stores/index.store';
import AppTitle from '../ui/task/app-title';
import {
    defaultCreateTaskFormValue,
    ListViewCreateTask,
} from '../ui/task/create-task';
import TaskContainer from '../ui/task/task-list';
import { useLayoutEffect, useState } from 'react';
import { fetcher } from '@/lib/http';
import { z } from 'zod';
import { TaskSchema } from '@/lib/zod.schema';

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
    const { isLoading } = useImportantTask();

    return isLoading ? null : (
        <>
            <header className="flex items-center justify-between w-full h-14 px-3"></header>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <AppTitle name="important" />
                    <div className="flex flex-col w-full flex-grow">
                        <div className="">
                            <ListViewCreateTask
                                defaultValue={{
                                    ...defaultCreateTaskFormValue,
                                    important: true,
                                }}
                            />
                        </div>

                        <TaskContainer />
                    </div>
                </div>
            </div>
        </>
    );
};
