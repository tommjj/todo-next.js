import { Task, TaskUpdate } from './zod.schema';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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

export const checkRectIntersect = (rect1: DOMRect, rect2: DOMRect) => {};

export function calculateOverlapArea(rectangle1: DOMRect, rectangle2: DOMRect) {
    // Xác định các cạnh giao nhau
    let top = Math.max(rectangle1.y, rectangle2.y);
    let bottom = Math.min(
        rectangle1.y + rectangle1.height,
        rectangle2.y + rectangle2.height
    );
    let left = Math.max(rectangle1.x, rectangle2.x);
    let right = Math.min(
        rectangle1.x + rectangle1.width,
        rectangle2.x + rectangle2.width
    );

    // Tính diện tích tiếp xúc
    let area = 0;
    if (top <= bottom && left <= right) {
        area = (bottom - top) * (right - left);
    }

    return area;
}
