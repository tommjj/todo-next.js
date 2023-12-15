'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, useCallback } from 'react';

export default function CreateTaskForm() {
    const handleDateInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            e.target.style.width = '20px';
        } else {
            e.target.style.width = '120px';
        }
    }, []);

    return (
        <div className="w-full border rounded-md shadow-sm shadow-[#00000040]">
            <form className="">
                <div className="flex items-center p-4">
                    <PlusIcon className="h-6 mr-4 text-[#0D6EFD]" />
                    <input
                        className="flex-grow outline-none font-light"
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
                            className="outline-none w-5 font-light "
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
