import { Task, TaskUpdate } from './zod.schema';

export function setTaskById(
    tasks: Task[],
    id: string,
    task: ((state: Task) => Task) | TaskUpdate
): [Task[], Task | undefined] {
    let newTask = undefined;

    const newTasks = tasks.map((item): Task => {
        if (item.id === id) {
            if (typeof task === 'function') {
                newTask = task(item);
                return newTask;
            } else {
                newTask = { ...item, ...task } as Task;
                return newTask;
            }
        }
        return item;
    });

    return [newTasks, newTask];
}
