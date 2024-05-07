import { Task } from '@/lib/zod.schema';
import Button from '../button';
import { useCallback, useMemo, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { cn } from '@/lib/utils';
import { AddSubtaskButton } from '../sub-task/subtask-create';
import { SubtaskItem } from '../sub-task/subtask-item';
import { SubTaskFormEditor } from '../sub-task/subtask-editor';

export const SubtaskView = ({ task }: { task: Task }) => {
    const [subtaskEditor, setSubtaskEditor] = useState<string | undefined>(
        undefined
    );
    const [isOpen, setIsOpen] = useState(true);
    const subtasks = task.subTasks;

    const toggleList = useCallback(() => setIsOpen((p) => !p), []);

    const handleClose = useCallback(() => setSubtaskEditor(undefined), []);

    const subTaskCompletedCount = useMemo(() => {
        return subtasks.reduce((pri, cur) => {
            return cur.completed ? pri + 1 : pri;
        }, 0);
    }, [subtasks]);

    return (
        <div>
            <Button
                onClick={toggleList}
                className="px-0 pt-[5px] pb-[3px] justify-start w-full grow font-medium text-[0.9rem] md:hover:bg-inherit rounded-none opacity-90 hover:opacity-100"
                variant="ghost"
            >
                <div className="p-0 rounded-sm">
                    <IoIosArrowForward
                        className={cn(
                            'h-6 w-5 pr-1 mt-1 transition-all duration-300 mr-1',
                            {
                                'rotate-90': isOpen,
                            }
                        )}
                    />
                </div>
                <span className="">Sub-tasks</span>
                <span className="ml-1 px-1 rounded font-light text-[0.8rem]">
                    {subTaskCompletedCount}/{subtasks.length}
                </span>
            </Button>
            <ul
                className={cn(
                    'ml-4 border-t overflow-hidden transition-all h-auto'
                )}
                style={{
                    maxHeight: `${
                        isOpen ? 60 * (1 + subtasks.length) + 100 : 0
                    }px`,
                }}
            >
                {subtasks.map((item) => (
                    <li key={`subtask::${item.id}`}>
                        {subtaskEditor !== item.id ? (
                            <SubtaskItem
                                subtask={item}
                                setEditor={() => setSubtaskEditor(item.id)}
                            />
                        ) : (
                            <SubTaskFormEditor
                                subTask={item}
                                onCancel={handleClose}
                            />
                        )}
                    </li>
                ))}
                <li>
                    <AddSubtaskButton taskId={task.id} />
                </li>
            </ul>
        </div>
    );
};
