'use client';

import { CiFlag1, CiStar, CiCalendar } from 'react-icons/ci';
import {
    BsCalendar3,
    BsCalendar3Event,
    BsCalendar,
    BsCalendar3Week,
    BsFlag,
    BsFlagFill,
} from 'react-icons/bs';
import { BiStar, BiSolidStar } from 'react-icons/bi';

import { fetcher } from '@/lib/http';
import { CreateTask, TaskSchema } from '@/lib/zod.schema';
import useStore from '@/lib/stores/index.store';
import { IoAddOutline } from 'react-icons/io5';
import { Task } from '@prisma/client';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { cn } from '@/lib/utils';
import Button from '../button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import { Calendar } from '@/components/ui-lib/ui/calendar';
import { buttonProps } from '../nav/nav-buttons';

// export default function CreateTaskForm({ listId }: { listId: string }) {
//     const titleInput = useRef<HTMLInputElement>(null);
//     const dueDateInput = useRef<HTMLInputElement>(null);
//     const listID = useStore((s) => s.list?.id);
//     const addTask = useStore((s) => s.addTask);

//     const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
//         async (e) => {
//             e.preventDefault();
//             if (!(titleInput.current && dueDateInput.current && listID)) return;

//             const [res] = await fetcher.post.json(`/api/lists/${listID}`, {
//                 title: titleInput.current.value,
//                 dueDate: dueDateInput.current.value,
//             } satisfies CreateTask);

//             if (res && res.ok) {
//                 const task = (await res.json()) as Task;

//                 const parse = TaskSchema.safeParse({ ...task, miniTasks: [] });

//                 if (parse.success) {
//                     addTask(parse.data);
//                 }
//             }

//             setTimeout(() => {
//                 if (titleInput.current && dueDateInput.current) {
//                     titleInput.current.value = '';

//                     dueDateInput.current.value = '';
//                     dueDateInput.current.style.width = '20px';
//                 }
//             });
//         },
//         [listID, addTask]
//     );

//     const handleShowDateInput = useCallback(
//         (e: ChangeEvent<HTMLInputElement>) => {
//             if (e.target.value === '') {
//                 e.target.style.width = '20px';
//             } else {
//                 e.target.style.width = '120px';
//             }
//         },
//         []
//     );

//     return (
//         <div className="w-full rounded-md border dark:border-nav-text-color-dark">
//             <form className="" onSubmit={handleSubmit}>
//                 <div className="flex items-center p-4">
//                     <PlusIcon className="h-6 mr-4 text-[#0D6EFD]" />
//                     <input
//                         ref={titleInput}
//                         className="flex-grow outline-none bg-inherit font-light"
//                         name="title"
//                         placeholder="add new task"
//                         type="text"
//                         autoComplete="off"
//                         autoCapitalize="off"
//                     />
//                 </div>

//                 <div className="flex w-full px-4 py-1">
//                     <div className="flex-grow ">
//                         <input
//                             ref={dueDateInput}
//                             onChange={handleShowDateInput}
//                             name="dueDate"
//                             className="outline-none w-5 font-light bg-inherit"
//                             id="createTaskDate"
//                             type="date"
//                         ></input>
//                     </div>
//                     <button
//                         type="submit"
//                         className="px-1 font-light text-[#0D6EFD]"
//                     >
//                         add
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

export const ImportantButton = ({
    defaultState = false,
    onChange = () => {},
}: {
    onChange?: (state: boolean) => void;
    defaultState?: boolean;
}) => {
    const [important, setImportant] = useState(defaultState);

    const handleClick = useCallback(() => {
        setImportant(!important);
        onChange(important);
    }, [important, onChange]);

    return (
        <Button
            onClick={handleClick}
            type="button"
            variant="ghost"
            className="text-[0.8rem] leading-4 px-2 py-[5px] font-light border"
        >
            {important ? (
                <BiSolidStar className="w-4 h-4 mr-1 opacity-80 text-primary-color" />
            ) : (
                <BiStar className="w-4 h-4 mr-1 opacity-50" />
            )}
            Important
        </Button>
    );
};

export const PriorityPicker = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    type="button"
                    variant="ghost"
                    className="text-[0.8rem] leading-4 px-2 py-[5px] font-light border"
                >
                    <CiFlag1 className="w-4 h-4 mr-1 opacity-80" />
                    Priority
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="w-32 px-1 py-2">
                    <ul>
                        <li>
                            <Button
                                {...buttonProps}
                                className={cn(
                                    buttonProps.className,
                                    'text-[0.8rem] font-normal opacity-80'
                                )}
                            >
                                <BsFlagFill className="w-5 h-5 p-[1px] mr-2 text-red-600" />
                                Priority 1
                            </Button>
                        </li>
                        <li>
                            <Button
                                {...buttonProps}
                                className={cn(
                                    buttonProps.className,
                                    'text-[0.8rem] font-normal opacity-80'
                                )}
                            >
                                <BsFlagFill className="w-5 h-5 p-[1px] mr-2 text-amber-600" />
                                Priority 2
                            </Button>
                        </li>
                        <li>
                            <Button
                                {...buttonProps}
                                className={cn(
                                    buttonProps.className,
                                    'text-[0.8rem] font-normal opacity-80'
                                )}
                            >
                                <BsFlagFill className="w-5 h-5 p-[1px] mr-2 text-blue-600" />
                                Priority 3
                            </Button>
                        </li>
                        <li>
                            <Button
                                {...buttonProps}
                                className={cn(
                                    buttonProps.className,
                                    'text-[0.8rem] font-normal opacity-80'
                                )}
                            >
                                <BsFlag className="w-5 h-5 p-[1px] mr-2" />
                                Priority 4
                            </Button>
                        </li>
                    </ul>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const DueDatePicker = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    type="button"
                    variant="ghost"
                    className="text-[0.8rem] leading-4 px-2 py-[5px] font-light border"
                >
                    <CiCalendar className="w-4 h-4 mr-1 opacity-80" />
                    Due date
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div
                    className="w-[242px] bg-main-bg-color dark:bg-main-bg-color-dark"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="border-b p-2">
                        <input
                            className="w-full outline-none placeholder:font-light text-[0.95rem] bg-inherit"
                            placeholder="Task name"
                            name="task name"
                            type="text"
                            autoComplete="off"
                            autoCapitalize="off"
                        />
                    </div>
                    <div className="px-1 py-[6px] border-b ">
                        <Button
                            {...buttonProps}
                            className={cn(
                                buttonProps.className,
                                'text-[0.8rem] font-normal opacity-80'
                            )}
                        >
                            <BsCalendar className="w-5 h-5 p-[1px] mr-2 text-green-600" />
                            Today
                        </Button>
                        <Button
                            {...buttonProps}
                            className={cn(
                                buttonProps.className,
                                'text-[0.8rem] font-normal opacity-80'
                            )}
                        >
                            <BsCalendar3Event className="w-5 h-5 p-[1px] mr-2 text-amber-600" />
                            Tomorrow
                        </Button>
                        <Button
                            {...buttonProps}
                            className={cn(
                                buttonProps.className,
                                'text-[0.8rem] font-normal opacity-80'
                            )}
                        >
                            <BsCalendar3Week className="w-5 h-5 p-[1px] mr-2 text-blue-600" />
                            This week
                        </Button>
                        <Button
                            {...buttonProps}
                            className={cn(
                                buttonProps.className,
                                'text-[0.8rem] font-normal opacity-80'
                            )}
                        >
                            <BsCalendar3 className="w-5 h-5 p-[1px] mr-2 text-indigo-600" />
                            This month
                        </Button>
                    </div>
                    <div className="flex justify-center w-full p-2">
                        <Calendar
                            fromMonth={date}
                            disabled={(day) => day < date}
                            mode="single"
                            onSelect={(e) => {
                                console.log(e);
                            }}
                            className=""
                        />
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const CreateTaskForm = ({
    className = '',
    onCancel,
}: {
    className?: string;
    onCancel?: () => void;
}) => {
    return (
        <form
            className={cn(
                'w-full border dark:border-[#FAFAFA] rounded-md',
                className
            )}
        >
            <div className="w-full px-[10px] pt-[10px]">
                <input
                    className="w-full outline-none placeholder:font-medium text-[0.95rem] bg-inherit"
                    placeholder="Task name"
                    name="task name"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="off"
                ></input>
                <textarea
                    onInput={(ev) => {
                        const el = ev.target as HTMLTextAreaElement;

                        el.style.height = '5px';
                        el.style.height = el.scrollHeight + 'px';
                    }}
                    className="w-full overflow-hidden h-max text-[0.8rem] outline-none font-light placeholder:font-light resize-none bg-inherit "
                    placeholder="Description"
                    name="description"
                    autoComplete="off"
                    autoCapitalize="off"
                    rows={1}
                ></textarea>
                <div className="flex gap-[0.35rem] py-2">
                    <DueDatePicker />
                    <PriorityPicker />
                    <ImportantButton />
                </div>
            </div>
            <div className="w-full flex justify-end gap-[0.35rem] p-[8px] border-t dark:border-[#FAFAFA]">
                <Button
                    className="text-[0.8rem] py-[0.35rem]"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    className="text-[0.8rem] py-[0.35rem]"
                    variant="primary"
                    onClick={onCancel}
                >
                    Add task
                </Button>
            </div>
        </form>
    );
};

export const ListViewCreateTask = ({ listId }: { listId: string }) => {
    const [isActive, seIsActive] = useState(false);

    const showForm = useCallback(() => seIsActive(true), []);
    const closeForm = useCallback(() => seIsActive(false), []);

    return !isActive ? (
        <button
            onClick={showForm}
            className="group flex px-2 items-center justify-start w-full h-11 text-[#777] hover:text-primary-color font-light"
        >
            <div className="group-hover:bg-primary-color group-hover:text-main-bg-color mr-[6px] rounded-full">
                <IoAddOutline className="w-5 h-5" />
            </div>
            Add task
        </button>
    ) : (
        <div>
            <CreateTaskForm onCancel={closeForm} />
        </div>
    );
};
