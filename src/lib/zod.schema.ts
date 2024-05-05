import { z } from 'zod';

// ENUM
export const RepeatInterval = z.enum([
    'NONE',
    'DAILY',
    'WEEKLY',
    'YEARLY',
    'MONTHLY',
]);

export const Priority = z.enum([
    'PRIORITY1',
    'PRIORITY2',
    'PRIORITY3',
    'PRIORITY4',
]);

export const ListColor = z.enum([
    'RED',
    'PURPLE',
    'GREEN',
    'BLUE',
    'YELLOW',
    'BLACK',
    'ORANGE',
    'NONE',
]);

export const EmptyStringToNull = z.preprocess.bind(null, (e) =>
    e === '' ? null : e
);
//*----====SCHEMA====----\\

export const SubTaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
    description: z.string().optional(),
    taskId: z.string(),
    createAt: z.coerce.date(),
});
export type SubTask = z.infer<typeof SubTaskSchema>;

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    important: z.boolean(),
    completed: z.boolean(),
    dueDate: z.nullable(z.coerce.date()),
    repeatInterval: RepeatInterval,
    repeatCount: z.nullable(z.number()),
    description: z.nullable(z.string()),
    subTasks: z.array(SubTaskSchema),
    priority: z.nullable(Priority),
    listId: z.string(),
    order: z.coerce.number(),
    createAt: z.coerce.date(),
});
export type Task = z.infer<typeof TaskSchema>;

export const ListSchema = z.object({
    id: z.string(),
    name: z.string(),
    userId: z.string(),
    color: z.nullable(z.string()),
    tasks: z.array(TaskSchema),
});
export type List = z.infer<typeof ListSchema>;

export const ListWithoutTasksSchema = ListSchema.omit({
    tasks: true,
});
export type ListWithoutTasksType = z.infer<typeof ListWithoutTasksSchema>;

export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    lists: z.array(ListSchema),
});
export type User = z.infer<typeof UserSchema>;

/*
 * ----==== UPDATE SCHEMA ====----
 */

export const ListUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    color: ListColor.optional(),
});
export type ListUpdateType = z.infer<typeof ListUpdateSchema>;

export const SubTaskUpdateSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    taskId: z.string().optional(),
});
export type SubTaskUpdate = z.infer<typeof SubTaskUpdateSchema>;

export const TaskUpdateSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    important: z.boolean().optional(),
    completed: z.boolean().optional(),
    dueDate: z.nullable(z.coerce.date()).optional(),
    repeatInterval: RepeatInterval.optional(),
    repeatCount: z.nullable(z.number()).optional(),
    description: z.nullable(z.string()).optional(),
    subTasks: z.array(SubTaskUpdateSchema).optional(),
    priority: z.nullable(Priority).optional(),
    listId: z.string().optional(),
    order: z.coerce.number().optional(),
    createAt: z.coerce.date().optional(),
});
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;

/*
 *   CREATE SCHEMA
 */

export const ListCreateSchema = z.object({
    name: z.string().min(1),
    color: ListColor.optional(),
});
export type ListCreateType = z.infer<typeof ListCreateSchema>;

export const SubTaskCreateSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    taskId: z.string(),
});
export const SubTaskCreateWithoutIdSchema = SubTaskCreateSchema.omit({
    id: true,
});
export type SubTaskCreateWithoutId = z.infer<
    typeof SubTaskCreateWithoutIdSchema
>;

export const SubTaskCreateWithoutIdAndTaskIdSchema = SubTaskCreateSchema.omit({
    id: true,
    taskId: true,
});

export type SubTaskCreateWithoutIdAndTaskId = z.infer<
    typeof SubTaskCreateWithoutIdAndTaskIdSchema
>;

export const CreateTaskSchema = z.object({
    title: z.string().min(1),
    important: z.boolean().optional(),
    completed: z.boolean().optional(),
    repeatInterval: RepeatInterval.optional(),
    repeatCount: z.nullable(z.number()).optional(),
    dueDate: EmptyStringToNull(z.nullable(z.coerce.date())).optional(),
    description: z.nullable(z.string()).optional(),
    priority: z.nullable(Priority).optional(),
    listId: z.string(),
    order: z.number().optional(),
    subTasks: z.array(SubTaskCreateWithoutIdAndTaskIdSchema).optional(),
});

export type CreateTask = z.infer<typeof CreateTaskSchema>;

export const AccountSchema = z.object({
    username: z.string({ invalid_type_error: 'please enter username' }).max(29),
    email: z.string().email(),
    password: z
        .string({ invalid_type_error: 'please enter password' })
        .min(8, { message: 'Password must be longer than 8 characters' }),
    confirm: z.string({ invalid_type_error: 'please enter password' }).min(8),
});

// * Repeat schema

export const SubTaskRepeatSchema = SubTaskCreateSchema.omit({
    id: true,
    taskId: true,
    completed: true,
});

export const TaskRepeatSchema = z.object({
    title: z.string().min(1),
    important: z.boolean().optional(),
    repeatInterval: RepeatInterval.optional(),
    repeatCount: z.nullable(z.number()).optional(),
    dueDate: z.nullable(z.coerce.date()).optional(),
    description: z.nullable(z.string()).optional(),
    priority: z.nullable(Priority).optional(),
    listId: z.string(),
    subTasks: z.array(SubTaskRepeatSchema).optional(),
});

/// Fetch type

export const ListFetchSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        userId: z.string(),
        color: z.nullable(z.string()),
        tasks: z.array(TaskSchema),
    })
    .or(
        z.object({
            tasks: z.array(TaskSchema),
        })
    );
export type ListFetchType = z.infer<typeof ListFetchSchema>;
