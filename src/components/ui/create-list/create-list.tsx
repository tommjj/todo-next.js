'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import CreateListForm from './create-list-form';

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
                    <CreateListForm />
                </div>
            )}
        </>
    );
}

export default CreateList;
