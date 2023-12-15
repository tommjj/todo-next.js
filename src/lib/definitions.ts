import { $Enums } from '@prisma/client';

export type Account = {
    username: string;
    password: string;
};

export type User = {
    id: string;
    name: string;
    lists?: List[];
};

export type List = {
    id: string;
    name: string;
    userId: string;
    tasks?: Task[];
};

export type Task = {
    id: string;
    title: string;
    important: boolean;
    completed: boolean;
    dueDate: Date;
    repeatInterval: $Enums.RepeatInterval;
    repeatCount: number | null;
    note: string | null;
    miniTasks?: MiniTask[];
    level: $Enums.Level | null;
    listId: string;
    order: number;
};

export type MiniTask = {
    id: string;
    title: string;
    completed: boolean;
    taskId: string;
};

export type ListWithTasks = {
    id: string;
    name: string;
    userId: string;
    tasks?: Task[];
};
