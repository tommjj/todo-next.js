import Button from '../button';

import { IoIosAddCircle, IoIosSearch } from 'react-icons/io';
import { GoInbox } from 'react-icons/go';
import { CiCalendar } from 'react-icons/ci';
import { CiStar } from 'react-icons/ci';

export const AddTaskButton = () => {
    return (
        <div className="w-full px-[10px] my-2">
            <Button
                className="px-[6px] py-[3px] justify-start w-full grow text-nav-text-color dark:text-nav-text-color-dark text-sm font-normal active:scale-[98%]"
                variant="ghost"
            >
                <IoIosAddCircle className="w-7 h-7 mr-[6px]" />
                Add task
            </Button>
        </div>
    );
};

export const SearchButton = () => {
    return (
        <Button
            className="px-[8px] py-[5px] justify-start w-full grow text-sm font-normal "
            variant="ghost"
        >
            <div>
                <IoIosSearch className="w-6 h-6 mr-[8px] text-[#444] dark:text-inherit" />
            </div>

            <div className="text-left line-clamp-1">Search</div>
        </Button>
    );
};

export const TodoButton = () => {
    return (
        <Button
            href="/tasks/todo"
            className="px-[8px] py-[5px] justify-start w-full grow text-sm font-normal"
            variant="ghost"
        >
            <div>
                <GoInbox className="w-6 h-6 p-[2px] mr-[8px] text-[#444] dark:text-inherit" />
            </div>

            <div className="text-left line-clamp-1">Todo</div>
        </Button>
    );
};

export const ImportantButton = () => {
    return (
        <Button
            href="/tasks/important"
            className="px-[8px] py-[5px] justify-start w-full grow text-sm font-normal"
            variant="ghost"
        >
            <div>
                <CiStar className="w-6 h-6 mr-[8px] text-[#444] dark:text-inherit" />
            </div>
            <div className="text-left line-clamp-1">Important</div>
        </Button>
    );
};

export const PlannedButton = () => {
    return (
        <Button
            href="/tasks/planned"
            className="px-[8px] py-[5px] justify-start w-full grow text-sm font-normal"
            variant="ghost"
        >
            <div>
                <CiCalendar className="w-6 h-6 mr-[8px] text-[#444] dark:text-inherit" />
            </div>

            <div className="text-left line-clamp-1">Planned</div>
        </Button>
    );
};
