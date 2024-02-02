import { z } from 'zod';

// ENUM
export const RepeatInterval = z.enum([
    'NONE',
    'DAILY',
    'WEEKLY',
    'YEARLY',
    'MONTHLY',
]);
export const Level = z.enum(['EASY', 'MEDIUM', 'DIFFICULT']);

export const EmptyStringToNull = z.preprocess.bind(null, (e) =>
    e === '' ? null : e
);
//----====SCHEMA====----\\

export const MiniTaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
    taskId: z.string(),
});
export type MiniTask = z.infer<typeof MiniTaskSchema>;

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    important: z.boolean(),
    completed: z.boolean(),
    dueDate: z.nullable(z.coerce.date()),
    repeatInterval: RepeatInterval,
    repeatCount: z.nullable(z.number()),
    note: z.nullable(z.string()),
    miniTasks: z.array(MiniTaskSchema),
    level: z.nullable(Level),
    listId: z.string(),
    order: z.number(),
    createAt: z.coerce.date(),
});
export type Task = z.infer<typeof TaskSchema>;

export const ListSchema = z.object({
    id: z.string(),
    name: z.string(),
    userId: z.string(),
    tasks: z.array(TaskSchema),
});
export type List = z.infer<typeof ListSchema>;

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    lists: z.array(ListSchema),
});
export type User = z.infer<typeof UserSchema>;

//----====UPDATE SCHEMA====----\\

export const MiniTaskUpdateSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    completed: z.boolean().optional(),
    taskId: z.string().optional(),
});
export type MiniTaskUpdate = z.infer<typeof MiniTaskUpdateSchema>;

export const TaskUpdateSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    important: z.boolean().optional(),
    completed: z.boolean().optional(),
    dueDate: z.nullable(z.coerce.date()).optional(),
    repeatInterval: RepeatInterval.optional(),
    repeatCount: z.nullable(z.number()).optional(),
    note: z.nullable(z.string()).optional(),
    miniTasks: z.array(MiniTaskUpdateSchema).optional(),
    level: z.nullable(Level).optional(),
    listId: z.string().optional(),
    order: z.number().optional(),
    createAt: z.coerce.date().optional(),
});
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;

export const CreateTaskSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    important: z.boolean().optional(),
    completed: z.boolean().optional(),
    repeatInterval: RepeatInterval.optional(),
    repeatCount: z.nullable(z.number()).optional(),
    dueDate: EmptyStringToNull(z.nullable(z.coerce.date())).optional(),
    note: z.nullable(z.string()).optional(),
    level: z.nullable(Level).optional(),
    listId: z.string().optional(),
    order: z.number().optional(),
    createAt: z.coerce.date().optional(),
});

export const AccountSchema = z.object({
    username: z.string({ invalid_type_error: 'please enter username' }).max(29),
    password: z
        .string({ invalid_type_error: 'please enter password' })
        .min(8, { message: 'Password must be longer than 8 characters' }),
    confirm: z.string({ invalid_type_error: 'please enter password' }).min(8),
});

export type CreateTask = z.infer<typeof CreateTaskSchema>;
