'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { createListAction } from '@/lib/action';
import { ChangeEvent, useCallback, useState } from 'react';

function CreateListForm() {
    const [inputValue, setInputValue] = useState('');

    const handleChangeInput = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []
    );

    const handleSubmit = useCallback(() => {
        setTimeout(() => {
            setInputValue('');
        });
    }, []);

    return (
        <form
            className="flex items-center w-full"
            action={createListAction}
            onSubmit={handleSubmit}
        >
            <PlusIcon className="h-6 text-[#0D6EFD] mr-4" />
            <input
                value={inputValue}
                onChange={handleChangeInput}
                autoCapitalize="off"
                autoComplete="off"
                type="text"
                name="listName"
                placeholder="create new list"
                className="flex-grow w-12 h-9 outline-none font-light bg-inherit"
            ></input>
        </form>
    );
}

export default CreateListForm;
