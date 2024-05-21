import { Task, TaskUpdateSchema } from '@/lib/zod.schema';
import { useCallback, useEffect, useRef, useState } from 'react';
import { $Enums } from '@prisma/client';
import { RepeatPicker, RepeatStateType } from '../inputs/repeat-picker';
import { TaskCheckBox } from '../task/task-list-item';
import { DueDatePicker } from '../inputs/due-date-picker';
import { PriorityPicker } from '../inputs/priority-picker';
import { ImportantPicker } from '../inputs/Important-picker';
import useStore from '@/lib/stores/index.store';
import { DescriptionInput, TaskNameInput } from '../inputs/text-input';
import { useParams } from 'next/navigation';

type FormStateType = {
    title: string;
    description: string;
    dueDate: Date | null;
    repeatCount: number;
    repeatInterval: $Enums.RepeatInterval;
    priority: $Enums.Priority;
    important: boolean;
};

export const DetailEditorTask = ({ task }: { task: Task }) => {
    const { board } = useParams();
    const currentList = useStore((s) => s.currentList);
    const ref = useRef<FormStateType | undefined>(undefined);
    const updateTask = useStore((s) => s.updateTask);
    const [formState, setFormState] = useState<FormStateType>({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate || null,
        repeatCount: task.repeatCount || 0,
        repeatInterval: task.repeatInterval || 'NONE',
        priority: task.priority || 'PRIORITY4',
        important: task.important,
    });

    useEffect(() => {
        if (ref.current && ref.current !== formState) {
            const parse = TaskUpdateSchema.safeParse({ ...task, ...formState });

            if (parse.success) {
                const sync = updateTask(task.id, parse.data);
                sync.sync();

                document.title = `${formState.title} - ${
                    currentList ? currentList.name : board
                }`;
            }
        }
        ref.current = formState;
    }, [board, currentList, formState, task, updateTask]);

    useEffect(() => {
        const test = function (e: any) {
            console.log(formState);

            // e.preventDefault();
        };

        window.addEventListener('beforeunload', test);
        return () => window.removeEventListener('beforeunload', test);
    }, [formState, updateTask]);

    const handleTaskNameChange: React.ChangeEventHandler<HTMLTextAreaElement> =
        useCallback(
            (e) => {
                if (formState.title !== e.target.value)
                    setFormState((priv) => ({
                        ...priv,
                        title: e.target.value,
                    }));
            },
            [formState.title]
        );

    const handleDescriptionChange: React.ChangeEventHandler<HTMLTextAreaElement> =
        useCallback(
            (e) => {
                if (formState.description !== e.target.value)
                    setFormState((priv) => ({
                        ...priv,
                        description: e.target.value,
                    }));
            },
            [formState.description]
        );

    const handleDueDayChange = useCallback((date: Date | null) => {
        setFormState((priv) => ({ ...priv, dueDate: date }));
    }, []);

    const handlePriorityChange = useCallback((priority: $Enums.Priority) => {
        setFormState((priv) => ({ ...priv, priority: priority }));
    }, []);

    const handleRepeatChange = useCallback(
        ({ repeat, repeatCount }: RepeatStateType) => {
            setFormState((priv) => ({
                ...priv,
                repeatInterval: repeat,
                repeatCount: repeatCount,
            }));
        },
        []
    );

    const handleImportantChange = useCallback((important: boolean) => {
        setFormState((priv) => ({ ...priv, important: important }));
    }, []);

    return (
        <div className="w-full px-1">
            <div className="flex pt-2 min-h-[60px]">
                <div className="flex pl-1 pt-[2px] items-center justify-center">
                    <TaskCheckBox completed={task.completed} taskId={task.id} />
                </div>
                <div className="flex items-center justify-center flex-grow ">
                    <TaskNameInput
                        className="text-lg font-medium"
                        onBlur={handleTaskNameChange}
                        defaultValue={formState.title}
                    />
                </div>
            </div>
            <div className="min-h-[50px]">
                <DescriptionInput
                    className="text-[0.9rem] mt-2 pl-1"
                    onBlur={handleDescriptionChange}
                    defaultValue={formState.description}
                />
            </div>
            <div className="flex gap-[0.35rem] flex-wrap py-2">
                <DueDatePicker
                    onChanged={handleDueDayChange}
                    defaultValue={formState.dueDate || undefined}
                />
                <PriorityPicker
                    onChanged={handlePriorityChange}
                    defaultValue={formState.priority}
                />
                <RepeatPicker
                    onChanged={handleRepeatChange}
                    defaultValue={{
                        repeat: formState.repeatInterval,
                        repeatCount: formState.repeatCount,
                    }}
                />
                <ImportantPicker
                    onChange={handleImportantChange}
                    defaultValue={formState.important}
                />
            </div>
        </div>
    );
};
