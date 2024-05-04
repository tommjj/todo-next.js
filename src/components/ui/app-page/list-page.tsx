'use client';

import { useLoadList } from '@/components/hook';
import { useParams } from 'next/navigation';
import { ListNotFound } from '../not-found/not-found';
import { AppHeader } from '../header/main-header';
import AppTitle from '../task/app-title';
import { ListViewCreateTask } from '../task/create-task';
import TaskList from '../task/task-list';

export const ListPage = () => {
    const { board } = useParams();
    const { isLoading, isNotFound } = useLoadList(board as string);

    return isLoading ? null : isNotFound ? (
        <ListNotFound />
    ) : (
        <>
            <AppHeader />
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <AppTitle />
                    <div className="flex flex-col w-full flex-grow">
                        <div className="">
                            <ListViewCreateTask />
                        </div>

                        <TaskList />
                    </div>
                </div>
            </div>
        </>
    );
};
