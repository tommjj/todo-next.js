import Button, { ButtonProps } from '../button';

import { IoIosAddCircle, IoIosSearch } from 'react-icons/io';
import { GoInbox } from 'react-icons/go';
import { CiCalendar } from 'react-icons/ci';
import { CiStar } from 'react-icons/ci';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import AlertDialog, {
    AlertDialogContent,
    AlertDialogTrigger,
    DialogRef,
} from '../alert-dialog/alert-dialog';
import { CreateTaskForm } from '../task/create-task';
import { useMemo, useRef } from 'react';
import useStore from '@/lib/stores/index.store';
import Search from '../search/search';

export const AddTaskButton = () => {
    const ref = useRef<DialogRef>(null);

    const { board } = useParams();

    const primaryList = useStore((s) => s.primary)!;
    const lists = useStore((s) => s.lists);
    const shareLists = useStore((s) => s.shareLists);

    const defaultList = useMemo(
        () =>
            [...lists, ...shareLists].find((l) => l.id === board) ||
            primaryList,
        [board, lists, primaryList, shareLists]
    );

    return (
        <div className="w-full px-[10px] my-1">
            <AlertDialog ref={ref}>
                <AlertDialogTrigger>
                    <Button
                        className="px-[6px] py-[3px] justify-start w-full grow text-primary-color dark:text-nav-text-color-dark text-sm font-normal active:scale-[98%]"
                        variant="ghost"
                    >
                        <IoIosAddCircle className="w-7 h-7 mr-[6px]" />
                        Add task
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                    ContentClassName="p-0  md:w-[540px] lg:w-[600px] mb-[220px] shadow-2xl shadow-[#00000040] border-none"
                    className="bg-[#00000000] backdrop-blur-none z-[998]"
                >
                    <CreateTaskForm
                        onAddTask={() => {
                            ref.current?.setIsOpen(false);
                        }}
                        defaultList={defaultList}
                        onCancel={() => {
                            ref.current?.setIsOpen(false);
                        }}
                    />
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export const buttonProps: ButtonProps = {
    className:
        'px-[8px] py-[5px] justify-start w-full grow text-sm font-normal font-light',
    variant: 'ghost',
};

export const buttonActiveClassName =
    'bg-nav-active-color text-nav-text-color font-normal dark:bg-main-bg-color-dark dark:text-inherit md:hover:bg-nav-active-color dark:hover:bg-main-bg-color-dark hover:opacity-100';

export const getButtonClassName = (isActive: boolean) => {
    return cn(buttonProps.className, { [buttonActiveClassName]: isActive });
};

export const SearchButton = () => {
    const ref = useRef<DialogRef>(null);

    return (
        <AlertDialog ref={ref}>
            <AlertDialogTrigger>
                <Button {...buttonProps}>
                    <div>
                        <IoIosSearch className="w-6 h-6 mr-[8px] text-[#444] dark:text-inherit" />
                    </div>

                    <div className="text-left line-clamp-1">Search</div>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
                ContentClassName="p-0 md:w-[640px] lg:w-[652px] shadow-2xl shadow-[#00000040] rounded-md"
                className="bg-[#00000000] backdrop-blur-none"
            >
                <Search
                    close={() => {
                        ref.current?.setIsOpen(false);
                    }}
                />
            </AlertDialogContent>
        </AlertDialog>
    );
};

export const TodoButton = () => {
    const { board } = useParams();

    return (
        <Button
            href="/tasks/todo"
            {...buttonProps}
            className={getButtonClassName(board === 'todo')}
        >
            <div>
                <GoInbox className="w-6 h-6 p-[2px] mr-[8px] text-[#444] dark:text-inherit" />
            </div>

            <div className="text-left line-clamp-1">Todo</div>
        </Button>
    );
};

export const ImportantButton = () => {
    const { board } = useParams();

    return (
        <Button
            href="/tasks/important"
            {...buttonProps}
            className={getButtonClassName(board === 'important')}
        >
            <div>
                <CiStar className="w-6 h-6 mr-[8px] text-[#444] dark:text-inherit" />
            </div>
            <div className="text-left line-clamp-1">Important</div>
        </Button>
    );
};

export const PlannedButton = () => {
    const { board } = useParams();

    return (
        <Button
            href="/tasks/planned"
            {...buttonProps}
            className={getButtonClassName(board === 'planned')}
        >
            <div>
                <CiCalendar className="w-6 h-6 mr-[8px] text-[#444] dark:text-inherit aria-" />
            </div>

            <div className="text-left line-clamp-1">Planned</div>
        </Button>
    );
};
