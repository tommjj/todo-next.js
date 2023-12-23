'use client';

import { createTaskAction } from '@/lib/action';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, useCallback, useRef } from 'react';

export default function CreateTaskForm({ listId }: { listId: string }) {
    const action = createTaskAction.bind(null, listId);
    const titleInput = useRef<HTMLInputElement>(null);
    const dueDateInput = useRef<HTMLInputElement>(null);

    const resetForm = useCallback(() => {
        setTimeout(() => {
            if (titleInput.current && dueDateInput.current) {
                titleInput.current.value = '';

                dueDateInput.current.value = '';
                dueDateInput.current.style.width = '20px';
            }
        });
    }, []);

    const handleShowDateInput = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            console.log(e.target.value);
            if (e.target.value === '') {
                e.target.style.width = '20px';
            } else {
                e.target.style.width = '120px';
            }
        },
        []
    );

    return (
        <div className="w-full border rounded-md shadow-sm shadow-[#00000040]">
            <form className="" action={action} onSubmit={resetForm}>
                <div className="flex items-center p-4">
                    <PlusIcon className="h-6 mr-4 text-[#0D6EFD]" />
                    <input
                        ref={titleInput}
                        className="flex-grow outline-none font-light dark:bg-[#111]"
                        name="title"
                        placeholder="add new task"
                        type="text"
                        autoComplete="none"
                        autoCapitalize="none"
                    />
                </div>
                <hr />
                <div className="flex w-full px-4 py-1">
                    <div className="flex-grow ">
                        <input
                            ref={dueDateInput}
                            onChange={handleShowDateInput}
                            name="dueDate"
                            className="outline-none w-5 font-light bg-white dark:bg-[#111]"
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
