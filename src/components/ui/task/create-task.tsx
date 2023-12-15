'use client';

import { createTask } from '@/lib/action';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, useCallback } from 'react';

export default function CreateTaskForm({ listId }: { listId: string }) {
    const action = createTask.bind(null, listId);

    const handleDateInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            e.target.style.width = '20px';
        } else {
            e.target.style.width = '120px';
        }
    }, []);

    return (
        <div className="w-full border rounded-md shadow-sm shadow-[#00000040]">
            <form className="" action={action}>
                <div className="flex items-center p-4">
                    <PlusIcon className="h-6 mr-4 text-[#0D6EFD]" />
                    <input
                        className="flex-grow outline-none font-light dark:bg-[#111]"
                        name="title"
                        placeholder="add new task"
                        type="text"
                        autoComplete="none"
                        autoCapitalize="none"
                        required
                    />
                </div>
                <hr />
                <div className="flex w-full px-4 py-1">
                    <div className="flex-grow ">
                        <input
                            onChange={handleDateInput}
                            name="dueDate"
                            className="outline-none w-5 font-light dark:bg-[#111]"
                            id="createTaskDate"
                            type="date"
                        ></input>
                    </div>
                    <button
                        type="submit"
                        className="px-1 font-light text-[#0D6EFD]"
                    >
                        add
                    </button>
                </div>
            </form>
        </div>
    );
}
