'use client';

import { fetcher } from '@/lib/http';
import { CreateTask, TaskSchema } from '@/lib/zod.schema';
import useStore from '@/lib/stores/index.store';
import { IoAddOutline } from 'react-icons/io5';
import { Task } from '@prisma/client';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';

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

export default function CreateTaskForm({ listId }: { listId: string }) {
    const [isActive, seIsActive] = useState(false);

    const showForm = useCallback(() => seIsActive(true), []);
    const closeForm = useCallback(() => seIsActive(false), []);

    return !isActive ? (
        <button
            onClick={showForm}
            className="group flex px-[10px] items-center justify-start w-full h-11 text-[#777] hover:text-primary-color font-light"
        >
            <div className="group-hover:bg-primary-color group-hover:text-main-bg-color mr-[6px] rounded-full">
                <IoAddOutline className="w-5 h-5" />
            </div>
            Add task
        </button>
    ) : (
        <div onClick={closeForm}>a</div>
    );
}
