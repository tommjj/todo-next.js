'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { createList } from '@/lib/action';
import { useState } from 'react';

function CreateListForm() {
    const [inputValue, setInputValue] = useState('');

    return (
        <form
            className="flex items-center w-full"
            action={createList}
            onSubmit={() => {
                setTimeout(() => {
                    setInputValue('');
                });
            }}
        >
            <PlusIcon className="h-6 text-[#0D6EFD] mr-4" />
            <input
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
                autoCapitalize="none"
                autoComplete="none"
                type="text"
                name="listName"
                placeholder="name.."
                className="flex-grow w-12 h-9 outline-none"
            ></input>
        </form>
    );
}

export default CreateListForm;
