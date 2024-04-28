import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { DescriptionInput, TaskNameInput } from '../inputs/text-input';
import Button from '../button';
import { fetcher, updateSubtaskById } from '@/lib/http';
import {
    SubTask,
    SubTaskCreateWithoutId,
    SubTaskSchema,
} from '@/lib/zod.schema';
import useStore from '@/lib/stores/index.store';

export const SubTaskFormEditor = ({
    className = '',
    onCancel,
    subTask,
}: {
    subTask: SubTask;
    className?: string;
    onCancel?: () => void;
}) => {
    const updateSubtask = useStore((s) => s.updateSubtask);
    const [formState, setFormState] = useState({
        title: subTask.title,
        description: subTask.description,
    });

    const handleTaskNameChange: React.ChangeEventHandler<HTMLTextAreaElement> =
        useCallback((e) => {
            setFormState((priv) => ({ ...priv, title: e.target.value }));
        }, []);

    const handleDescriptionChange: React.ChangeEventHandler<HTMLTextAreaElement> =
        useCallback((e) => {
            setFormState((priv) => ({ ...priv, description: e.target.value }));
        }, []);

    const submit = useCallback(async () => {
        if (formState.title.trim() === '') return;

        const { sync } = updateSubtask(subTask, { ...formState });
        sync();
        onCancel && onCancel();
    }, [formState, onCancel, subTask, updateSubtask]);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
        async (e) => {
            e.preventDefault();

            submit();
        },
        [submit]
    );

    return (
        <form
            className={cn(
                'w-full border dark:border-[#FAFAFA] rounded-md',
                className
            )}
            onSubmit={handleSubmit}
        >
            <div className="w-full px-[10px] pt-[10px]">
                <TaskNameInput
                    onSubmit={submit}
                    value={formState.title}
                    onChange={handleTaskNameChange}
                />
                <DescriptionInput
                    value={formState.description}
                    onChange={handleDescriptionChange}
                />
            </div>
            <div className="w-full flex justify-end gap-[0.35rem] p-[8px] border-t dark:border-[#FAFAFA]">
                <Button
                    type="button"
                    className="text-[0.8rem] py-[0.35rem]"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    className="text-[0.8rem] py-[0.35rem] aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                    variant="primary"
                    aria-disabled={formState.title.trim() === ''}
                >
                    Add sub-task
                </Button>
            </div>
        </form>
    );
};
