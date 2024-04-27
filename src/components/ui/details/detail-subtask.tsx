import { Task } from '@/lib/zod.schema';
import Button from '../button';
import { useCallback, useMemo, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { cn } from '@/lib/utils';

export const SubtaskView = ({ task }: { task: Task }) => {
    const [isOpen, setIsOpen] = useState(true);
    const subtasks = task.subTasks;

    const toggleList = useCallback(() => setIsOpen((p) => !p), []);

    const subTaskCompletedCount = useMemo(() => {
        return subtasks.reduce((pri, cur) => {
            return cur.completed ? ++pri : pri;
        }, 0);
    }, [subtasks]);

    return (
        <div>
            <Button
                onClick={toggleList}
                className="px-0 pt-[5px] pb-[3px] justify-start w-full grow font-normal text-[0.9rem] md:hover:bg-inherit rounded-none opacity-80 hover:opacity-90"
                variant="ghost"
            >
                <div className="p-0 rounded-sm">
                    <IoIosArrowForward
                        className={cn(
                            'h-6 w-6 p-1 transition-all duration-300',
                            {
                                'rotate-90': isOpen,
                            }
                        )}
                    />
                </div>
                Sub tasks{' '}
                <span className="ml-1 px-1 rounded font-light text-[0.8rem]">
                    {subTaskCompletedCount}/{subtasks.length}
                </span>
            </Button>
            <ul className="ml-5 pr-1 border-t"></ul>
        </div>
    );
};
