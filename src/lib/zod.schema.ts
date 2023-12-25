import { z } from 'zod';

export const RepeatInterval = z.enum([
    'NONE',
    'DAILY',
    'WEEKLY',
    'YEARLY',
    'MONTHLY',
]);
export const Level = z.enum(['EASY', 'MEDIUM', 'DIFFICULT']);

export const MiniTasksSchema = z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
    taskId: z.string(),
});

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    important: z.boolean(),
    completed: z.boolean(),
    dueDate: z.null().or(z.coerce.date()),
    repeatInterval: RepeatInterval,
    repeatCount: z.number().or(z.null()),
    note: z.string().or(z.null()),
    miniTasks: z.array(MiniTasksSchema),
    level: Level.or(z.null()),
    listId: z.string(),
    order: z.number(),
    createAt: z.coerce.date(),
});

export const ListSchema = z.object({
    id: z.string(),
    name: z.string(),
    userId: z.string(),
    tasks: z.array(TaskSchema),
});

export const MiniTaskUpdateSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    completed: z.boolean().optional(),
    taskId: z.string().optional(),
});

export const TaskUpdateSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    important: z.boolean().optional(),
    completed: z.boolean().optional(),
    dueDate: z.coerce.date().or(z.null()).optional(),
    repeatInterval: RepeatInterval.optional(),
    repeatCount: z.number().or(z.null()).optional(),
    note: z.string().or(z.null()).optional(),
    miniTasks: z.array(MiniTaskUpdateSchema).optional(),
    level: Level.or(z.null()).optional(),
    listId: z.string().optional(),
    order: z.number().optional(),
    createAt: z.coerce.date().optional(),
});

export const CreateTaskSchema = z.object({
    title: z.string().min(1),
    dueDate: z.coerce.date().or(
        z
            .string()
            .max(0)
            .transform((e) => undefined)
    ),
});

export const AccountSchema = z.object({
    username: z.string({ invalid_type_error: 'please enter username' }).max(29),
    password: z
        .string({ invalid_type_error: 'please enter password' })
        .min(8, { message: 'Password must be longer than 8 characters' }),
    confirm: z.string({ invalid_type_error: 'please enter password' }).min(8),
});
