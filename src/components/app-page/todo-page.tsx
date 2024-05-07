'use client';

import { useLoadList } from '@/components/hook';
import AppTitle from '../ui/task/app-title';
import { ListViewCreateTask } from '../ui/task/create-task';
import SortTasksListContainer from '../ui/task/sort-list-container';

export const TodoPage = () => {
    const { isLoading } = useLoadList('todo');

    return isLoading ? null : (
        <>
            <header className="flex items-center justify-between w-full h-14 px-3"></header>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <AppTitle name="todo" />
                    <div className="flex flex-col w-full flex-grow">
                        <div className="">
                            <ListViewCreateTask />
                        </div>

                        <SortTasksListContainer />
                    </div>
                </div>
            </div>
        </>
    );
};
