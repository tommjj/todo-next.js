import { z } from 'zod';

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
