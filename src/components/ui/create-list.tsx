'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Button from './button';

function CreateList() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {!isOpen ? (
                <div>
                    <button
                        onClick={() => {
                            setIsOpen(true);
                        }}
                        className="px-2 flex items-center justify-center text-[#0D6EFD]"
                        aria-label="open create list"
                    >
                        <PlusIcon className="h-6" />
                    </button>
                </div>
            ) : (
                <div className="flex-grow pl-1">
                    <form className="flex items-center w-full">
                        <input
                            type="text"
                            name="listName"
                            placeholder="name.."
                            className="flex-grow w-12 mx-1 h-9 px-2 outline-none"
                        ></input>
                        <Button variant="primary" className="w-14 h-9">
                            add
                        </Button>
                    </form>
                </div>
            )}
        </>
    );
}

export default CreateList;
