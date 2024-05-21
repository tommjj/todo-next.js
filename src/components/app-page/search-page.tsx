'use client';

import useStore from '@/lib/stores/index.store';
import AppTitle from '../ui/task/app-title';
import { useLayoutEffect, useState } from 'react';
import { fetcher } from '@/lib/http';
import { z } from 'zod';
import { TaskSchema } from '@/lib/zod.schema';
import {
    TasksCompletedTskList,
    TasksNotCompletedList,
} from '../ui/task/list-container';
import { useSearchParams } from 'next/navigation';
import { ListNotFound } from '../ui/not-found/not-found';
import Search from '../ui/search/search';
import { Header } from '../ui/header/main-header';

export const useSearchTask = (q: string | null) => {
    const setList = useStore((s) => s.setList);
    const [state, setState] = useState({
        isLoading: true,
        isNotFound: false,
    });

    useLayoutEffect(() => {
        setState({ isLoading: true, isNotFound: false });
        if (!q) {
            setState({ isLoading: false, isNotFound: true });
            return;
        }
        fetcher.get(`/v1/api/tasks/search/${q}`).then(async ([res]) => {
            if (!res?.ok) {
                setState({ isLoading: false, isNotFound: true });
                return;
            }

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
    }, [q, setList]);

    return state;
};

export const SearchPage = () => {
    const s = useSearchParams();
    const q = s.get('q');
    const tasks = useStore((state) => state.tasks);
    const { isLoading, isNotFound } = useSearchTask(q);

    return isLoading ? null : isNotFound ? (
        <>
            <Header listTitle="Share" />
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <AppTitle name={` Search`} />
                    <div className="flex flex-col w-full flex-grow">
                        <div className="w-full flex-grow relative">
                            <Search />
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <>
            <Header listTitle={`Results for "${s.get('q')}"`} />
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <AppTitle name={`Results for "${s.get('q')}"`} />
                    <div className="flex flex-col w-full flex-grow">
                        <div className="h-4"></div>
                        <div className="w-full flex-grow relative">
                            <TasksNotCompletedList tasks={tasks} />
                            <TasksCompletedTskList tasks={tasks} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
