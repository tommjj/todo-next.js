import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { DescriptionInput, TaskNameInput } from '../inputs/text-input';
import Button from '../button';
import { fetcher } from '@/lib/http';
import { SubTaskCreateWithoutId, SubTaskSchema } from '@/lib/zod.schema';
import useStore from '@/lib/stores/index.store';

export const CreateTaskForm = ({
    className = '',
    onCancel,
    taskId,
}: {
    taskId: string;
    className?: string;
    onCancel?: () => void;
}) => {
    const addSubtask = useStore((s) => s.addSubtask);
    const [formState, setFormState] = useState({
        title: '',
        description: '',
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

        const [res, err] = await fetcher.post.json('/v1/api/subtasks', {
            title: formState.title,
            description: formState.description,
            taskId: taskId,
        } satisfies SubTaskCreateWithoutId);

        if (res?.ok) {
            const json = await res.json();

            const data = SubTaskSchema.safeParse(json.data);

            if (data.success) {
                addSubtask(data.data);
            }

            onCancel && onCancel();
        }
    }, [addSubtask, formState.description, formState.title, onCancel, taskId]);

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
                    onEnter={submit}
                    value={formState.title}
                    onChange={handleTaskNameChange}
                    autoFocus
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

export const AddSubtaskButton = ({ taskId }: { taskId: string }) => {
    const [isActive, seIsActive] = useState(false);

    const showForm = useCallback(() => seIsActive(true), []);
    const closeForm = useCallback(() => seIsActive(false), []);

    return !isActive ? (
        <button
            onClick={showForm}
            className="group flex items-center justify-start w-full h-11 text-[#777] hover:text-primary-color font-light text-[0.9rem]"
        >
            <div className="group-hover:bg-primary-color group-hover:text-main-bg-color mr-[6px] rounded-full">
                <IoAddOutline className="w-[1.15rem] h-[1.15rem]" />
            </div>
            Add sub-task
        </button>
    ) : (
        <div className="mt-1">
            <CreateTaskForm taskId={taskId} onCancel={closeForm} />
        </div>
    );
};
