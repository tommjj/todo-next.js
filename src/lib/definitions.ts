import { Prisma, PrismaClient } from '@prisma/client';
import db from './db';

export enum Level {
    'EASY',
    'MEDIUM',
    'DIFFICULT',
}

export enum RepeatInterval {
    'NONE',
    'DAILY',
    'WEEKLY',
    'YEARLY',
    'MONTHLY',
}

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
};

export type Task = {
    id: string;
    title: string;
    important: boolean;
    completed: boolean;
    dueDate: Date;
    repeatInterval: RepeatInterval;
    repeatCount?: number;
    note?: string;
    miniTasks?: MiniTask[];
    level?: Level;
    listId: string;
    order: number;
};

export type MiniTask = {
    id: string;
    title: string;
    completed: boolean;
    taskId: string;
};
