import Button, { ButtonProps } from '../button';

import { IoIosAddCircle, IoIosSearch } from 'react-icons/io';
import { GoInbox } from 'react-icons/go';
import { CiCalendar } from 'react-icons/ci';
import { CiStar } from 'react-icons/ci';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export const AddTaskButton = () => {
    const { board } = useParams();

    return (
        <div className="w-full px-[10px] my-1">
            <Button
                className="px-[6px] py-[3px] justify-start w-full grow text-primary-color dark:text-nav-text-color-dark text-sm font-normal active:scale-[98%]"
                variant="ghost"
            >
                <IoIosAddCircle className="w-7 h-7 mr-[6px]" />
                Add task
            </Button>
        </div>
    );
};

export const buttonProps: ButtonProps = {
    className:
        'px-[8px] py-[5px] justify-start w-full grow text-sm font-normal font-light',
    variant: 'ghost',
};

export const activeClassName =
    'bg-nav-active-color text-nav-text-color font-normal dark:bg-main-bg-color-dark dark:text-inherit md:hover:bg-nav-active-color dark:hover:bg-main-bg-color-dark hover:opacity-100';

export const getButtonClassName = (isActive: boolean) => {
    return cn(buttonProps.className, { [activeClassName]: isActive });
};

export const SearchButton = () => {
    const { board } = useParams();

    return (
        <Button {...buttonProps}>
            <div>
                <IoIosSearch className="w-6 h-6 mr-[8px] text-[#444] dark:text-inherit" />
            </div>

            <div className="text-left line-clamp-1">Search</div>
        </Button>
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
