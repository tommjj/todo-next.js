'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { createList } from '@/lib/action';
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
            action={createList}
            onSubmit={handleSubmit}
        >
            <PlusIcon className="h-6 text-[#0D6EFD] mr-4" />
            <input
                value={inputValue}
                onChange={handleChangeInput}
                autoCapitalize="none"
                autoComplete="none"
                type="text"
                name="listName"
                placeholder="create new list"
                className="flex-grow w-12 h-9 outline-none font-light"
            ></input>
        </form>
    );
}

export default CreateListForm;
