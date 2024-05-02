'use client';

import useStore from '@/lib/stores/index.store';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useState } from 'react';

function CreateListForm() {
    const { push } = useRouter();
    const addListSync = useStore((s) => s.addListSync);
    const [inputValue, setInputValue] = useState('');

    const handleChangeInput = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []
    );

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
        async (e) => {
            e.preventDefault();

            const list = await addListSync({ name: inputValue });

            if (list) {
                push(`/tasks/${list.id}`);
            }
            setTimeout(() => {
                setInputValue('');
            });
        },
        [addListSync, inputValue, push]
    );

    return (
        <form
            className="group flex items-center w-full px-[10px] py-[2px] "
            onSubmit={handleSubmit}
        >
            <PlusIcon className="h-6 w-6 p-[2px] mr-2 rounded-full text-[#444] dark:text-inherit" />

            <input
                value={inputValue}
                onChange={handleChangeInput}
                autoCapitalize="off"
                autoComplete="off"
                type="text"
                name="listName"
                placeholder="Create new list"
                className="flex-grow w-12 h-8 outline-none font-light bg-inherit"
            ></input>
        </form>
    );
}

export default CreateListForm;
