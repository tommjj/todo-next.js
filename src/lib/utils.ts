import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Task, TaskUpdate } from './zod.schema';

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

    let area = 0;
    if (top <= bottom && left <= right) {
        area = (bottom - top) * (right - left);
    }

    return area;
}
export function createDebounce(func: Function, timeout: number) {
    let timer: string | number | NodeJS.Timeout | undefined;
    return {
        func(...agr: any) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, agr);
            }, timeout);
        },
        clear() {
            clearTimeout(timer);
        },
    };
}

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}
