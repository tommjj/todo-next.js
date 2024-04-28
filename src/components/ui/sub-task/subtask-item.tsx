import { cn } from '@/lib/utils';
import { SubTask } from '@/lib/zod.schema';
import { CheckIcon } from '@heroicons/react/24/outline';

export const SubTaskCheckBox = ({ subtask }: { subtask: SubTask }) => {
    return (
        <button
            // onClick={handleClick}
            className={`flex justify-center items-center w-4 h-4 border border-primary-color dark:border-primary-color-dark rounded-full group ${cn(
                {
                    'bg-primary-color dark:bg-primary-color-dark':
                        subtask.completed,
                }
            )}`}
        >
            <CheckIcon
                className={`h-2  ${cn({
                    'hidden md:group-hover:block': !subtask.completed,
                    'text-white dark:text-main-bg-color-dark':
                        subtask.completed,
                })}`}
                strokeWidth={3}
            />
        </button>
    );
};

export const SubtaskItem = ({ subtask }: { subtask: SubTask }) => {
    return (
        <div className="flex w-full py-1.5 border-b">
            <div
                className={cn('flex justify-center items-start px-2 pt-[3px]', {
                    'pt-1': subtask.description,
                })}
            >
                <SubTaskCheckBox subtask={subtask} />
            </div>
            <div>
                <div className="text-[0.9rem]">{subtask.title}</div>
                <div className="text-[0.8rem] font-light opacity-80">
                    {subtask.description}
                </div>
            </div>
        </div>
    );
};
