import Button from '../button';

import { IoIosAddCircle } from 'react-icons/io';

export const AddTaskButton = () => {
    return (
        <div className="w-full px-[10px] my-2">
            <Button
                className="px-[6px] py-[3px] justify-start w-full grow text-nav-text-color text-sm font-normal active:scale-[98%]"
                variant="ghost"
            >
                <IoIosAddCircle className="w-7 h-7 mr-[6px]" />
                Add task
            </Button>
        </div>
    );
};
