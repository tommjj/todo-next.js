import { type ClassValue, clsx } from 'clsx';
import { twMerge, ClassNameValue } from 'tailwind-merge';

import { Task, TaskUpdate } from './zod.schema';
import { ArgumentTypes, ReturnTypes } from './definitions';

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

export const convertTime = (date: Date | null | undefined) => {
    if (!date) return date;

    const utcDate = new Date(date);
    const utcOffset = utcDate.getTimezoneOffset() * 60 * 1000;
    const ictOffset = 7 * 60 * 60 * 1000;
    const ictTimeInMs = utcDate.getTime() + ictOffset - utcOffset;
    const ictDate = new Date(ictTimeInMs);
    return ictDate;
};

//

export const Days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday ',
    'Saturday',
];

export const Months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

export const getDateOffset = (from: Date, to: Date) => {
    const fromWithoutTime = new Date(
        from.getFullYear(),
        from.getMonth(),
        from.getDate()
    );

    const toWithoutTime = new Date(
        to.getFullYear(),
        to.getMonth(),
        to.getDate()
    );

    return (
        (toWithoutTime.getTime() - fromWithoutTime.getTime()) /
        (24 * 60 * 60 * 1000)
    );
};

export const getDateTitle = (date: Date) => {
    const now = new Date();

    const offset = getDateOffset(now, date);

    if (offset < -1 || offset > 7)
        return `${date.getDate()} ${Months[date.getMonth()]}${
            now.getFullYear() === date.getFullYear()
                ? ``
                : ` ${date.getFullYear()}`
        }`;
    if (offset === -1) return 'Yesterday';
    if (offset === 0) return 'Today';
    if (offset === 1) return 'Tomorrow';
    return Days[date.getDay()];
};

export const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
};

export const daysIntoYear = (date: Date) => {
    return (
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
            Date.UTC(date.getFullYear(), 0, 0)) /
        24 /
        60 /
        60 /
        1000
    );
};

//* with err
export const withError = <T extends Function>(
    func: T
): ((
    ...a: ArgumentTypes<T>
) => Promise<[undefined, unknown] | [ReturnTypes<T>, undefined]>) => {
    return async (...a: ArgumentTypes<T>) => {
        try {
            const data = (await func(...a)) as ReturnTypes<T>;

            return [data, undefined];
        } catch (err) {
            return [undefined, err];
        }
    };
};
