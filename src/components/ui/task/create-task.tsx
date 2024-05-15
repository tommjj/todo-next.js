'use client';

import { fetcher } from '@/lib/http';
import {
    CreateTask,
    CreateTaskSchema,
    ListWithoutTasksType,
    TaskSchema,
} from '@/lib/zod.schema';
import useStore from '@/lib/stores/index.store';
import { IoAddOutline } from 'react-icons/io5';
import { $Enums, Task } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import Button from '../button';

import { PriorityPicker } from '../inputs/priority-picker';
import { RepeatPicker, RepeatStateType } from '../inputs/repeat-picker';
import { DueDatePicker } from '../inputs/due-date-picker';
import { ImportantPicker } from '../inputs/Important-picker';
import { DescriptionInput, TaskNameInput } from '../inputs/text-input';
import ListSelector from '../inputs/list-selector';
import { useParams } from 'next/navigation';

export type CreateTaskFormStateType = {
    title: string;
    description: string;
    dueDate: null | Date;
    repeatCount: number;
    repeatInterval: $Enums.RepeatInterval;
    priority: $Enums.Priority;
    important: boolean;
};

export const defaultCreateTaskFormValue: CreateTaskFormStateType = {
    title: '',
    description: '',
    dueDate: null,
    repeatCount: 0,
    repeatInterval: 'NONE',
    priority: 'PRIORITY4',
    important: false,
};

export const CreateTaskForm = ({
    className = '',
    onCancel,
    onAddTask,
    defaultList,
    defaultValue = defaultCreateTaskFormValue,
}: {
    defaultList: ListWithoutTasksType;
    className?: string;
    onAddTask?: () => void;
    onCancel?: () => void;
    defaultValue?: CreateTaskFormStateType;
}) => {
    const [formState, setFormState] =
        useState<CreateTaskFormStateType>(defaultValue);
    const [list, setList] = useState(defaultList);
    const curList = useStore((s) => s.currentList);

    const addTask = useStore((s) => s.addTask);

    const handleTaskNameChange: React.ChangeEventHandler<HTMLTextAreaElement> =
        useCallback((e) => {
            setFormState((priv) => ({ ...priv, title: e.target.value }));
        }, []);

    const handleDescriptionChange: React.ChangeEventHandler<HTMLTextAreaElement> =
        useCallback((e) => {
            setFormState((priv) => ({ ...priv, description: e.target.value }));
        }, []);

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

    const submit = useCallback(async () => {
        if (formState.title.trim() === '') return;

        const parse = CreateTaskSchema.safeParse({
            ...formState,
            listId: list.id,
        });
        if (!parse.success) return;

        const [res] = await fetcher.post.json(`/v1/api/tasks`, {
            ...parse.data,
        } satisfies CreateTask);

        if (res && res.ok) {
            const task = (await res.json()).data as Task;

            const parse = TaskSchema.safeParse({
                ...task,
            });

            if (parse.success) {
                if (!curList || curList?.id === list.id) {
                    addTask(parse.data);
                }
                setList(defaultList);
                setFormState(defaultValue);
                onAddTask && onAddTask();
            }
        }
    }, [
        addTask,
        curList,
        defaultList,
        defaultValue,
        formState,
        list.id,
        onAddTask,
    ]);

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
                <div className="flex gap-[0.35rem] flex-wrap py-2">
                    <DueDatePicker
                        onChanged={handleDueDayChange}
                        defaultValue={
                            formState.dueDate === null
                                ? undefined
                                : formState.dueDate
                        }
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

            <div className="w-full flex justify-between p-[8px] border-t dark:border-[#FAFAFA]">
                <div>
                    <ListSelector defaultValue={list} onChanged={setList} />
                </div>
                <div className="flex gap-[0.35rem] ">
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
                        Add task
                    </Button>
                </div>
            </div>
        </form>
    );
};

export const ListViewCreateTask = ({
    listId,
    defaultValue,
}: {
    listId?: string;
    defaultValue?: CreateTaskFormStateType;
}) => {
    const { board } = useParams();
    const [isActive, seIsActive] = useState(false);

    const primaryList = useStore((s) => s.primary)!;
    const shareLists = useStore((s) => s.shareLists);
    const lists = useStore((s) => s.lists);

    const showForm = useCallback(() => seIsActive(true), []);
    const closeForm = useCallback(() => seIsActive(false), []);

    const defaultList = useMemo(
        () =>
            [...lists, ...shareLists].find((l) => l.id === (listId || board)) ||
            primaryList,
        [board, listId, lists, primaryList, shareLists]
    );

    return !isActive ? (
        <button
            onClick={showForm}
            className="group flex items-center justify-start w-full h-11 text-[#777] hover:text-primary-color font-light"
        >
            <div className="group-hover:bg-primary-color group-hover:text-main-bg-color mr-[6px] rounded-full">
                <IoAddOutline className="w-5 h-5" />
            </div>
            Add task
        </button>
    ) : (
        <div>
            <CreateTaskForm
                defaultList={defaultList}
                onCancel={closeForm}
                defaultValue={defaultValue}
            />
        </div>
    );
};
