'use client';

import useStore from '@/lib/stores/index.store';
import { ListWithoutTasksType } from '@/lib/zod.schema';
import { PlusIcon } from '@heroicons/react/24/solid';
import { ChangeEvent, useCallback, useState } from 'react';

function ListEditor({
    list,
    onClose,
}: {
    list: ListWithoutTasksType;
    onClose?: () => void;
}) {
    const updateListById = useStore((s) => s.updateListById);
    const [inputValue, setInputValue] = useState(list.name);

    const handleChangeInput = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []
    );

    const submit = useCallback(() => {
        const { sync } = updateListById(list.id, { name: inputValue });
        sync();
        onClose && onClose();
    }, [inputValue, list.id, onClose, updateListById]);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
        async (e) => {
            e.preventDefault();
            submit();
        },
        [submit]
    );

    const handleBurl = useCallback(async () => {
        submit();
    }, [submit]);

    return (
        <form
            className="group flex items-center w-full px-[10px] py-[2px] "
            onSubmit={handleSubmit}
        >
            <PlusIcon className="h-6 w-6 p-[2px] mr-2 rounded-full text-[#444] dark:text-inherit" />

            <input
                onBlur={handleBurl}
                value={inputValue}
                onChange={handleChangeInput}
                autoCapitalize="off"
                autoComplete="off"
                type="text"
                name="listName"
                placeholder="list name"
                autoFocus
                className="flex-grow w-12 h-8 outline-none font-light bg-inherit"
            ></input>
        </form>
    );
}

export default ListEditor;
