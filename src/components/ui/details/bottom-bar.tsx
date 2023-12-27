'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Task } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

function BottomBar({ task }: { task: Task }) {
    const pathname = usePathname();
    const { push } = useRouter();

    const handleClickOverlay = useCallback(() => {
        push(pathname);
    }, [pathname, push]);

    return (
        <div className="h-14 flex items-center px-5 border-t justify-between font-light text-[#333]">
            <button
                className="py-2"
                onClick={handleClickOverlay}
                aria-label="close detail"
            >
                <ArrowRightIcon className="h-[19px]" strokeWidth={1} />
            </button>
            <span className="text-sm">
                Create at {task.createAt.toDateString()}
            </span>
            <button className="">
                <TrashIcon
                    className="h-[19px]"
                    strokeWidth={1}
                    aria-label="delete task"
                />
            </button>
        </div>
    );
}

export default BottomBar;
