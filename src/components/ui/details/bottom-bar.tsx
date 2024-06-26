'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { BsLayoutSidebarReverse } from 'react-icons/bs';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

import useStore from '@/lib/stores/index.store';
import { toast } from '../sonner/sonner';
import { Task } from '@/lib/zod.schema';

function BottomBar({ task }: { task: Task }) {
    const { board } = useParams();
    const { push } = useRouter();
    const deleteTask = useStore((state) => state.removeTask);

    const handleClickOverlay = useCallback(() => {
        push(`?`);
    }, [push]);

    return (
        <div className="sticky bottom-0 left-0 h-14 flex items-center px-5 border-t justify-between font-light text-[#333] ">
            <button
                className="py-2"
                onClick={handleClickOverlay}
                aria-label="close detail"
            >
                <BsLayoutSidebarReverse className="h-[19px]" />
            </button>
            <span className="text-sm">
                Created at {task.createAt.toDateString()}
            </span>

            <button
                className="py-2"
                onClick={async () => {
                    setTimeout(() => {
                        handleClickOverlay();
                    });
                    const { sync, cancel } = deleteTask(task.id);

                    toast({
                        title: 'deleted',
                        description: `deleted ${task.title}`,
                        callBack: async () => {
                            await sync();
                        },
                        action: {
                            label: 'cancel',
                            onClick: () => {
                                cancel();
                            },
                        },
                    });
                }}
            >
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
