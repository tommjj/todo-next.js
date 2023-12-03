'use server';

import { z } from 'zod';
import { createUser, getUser } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const AccountSchema = z.object({
    username: z.string({ invalid_type_error: 'please enter username' }).max(29),
    password: z
        .string({ invalid_type_error: 'please enter password' })
        .min(8, { message: 'Password must be longer than 8 characters' }),
    confirm: z.string({ invalid_type_error: 'please enter password' }).min(8),
});

export type State =
    | {
          errors?: {
              username?: string[];
              password?: string[];
          };
          message?: string | null;
      }
    | undefined;

export async function createAccountAction(
    privState: State,
    formData: FormData
) {
    const newAccount = Object.fromEntries(formData);

    const validatedFields = AccountSchema.safeParse({
        username: newAccount.username,
        password: newAccount.password,
        confirm: newAccount.confirm,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create account!',
        };
    }

    const { username, password, confirm } = validatedFields.data;

    const user = await getUser(username);

    if (user) {
        return {
            errors: { username: ['username is already exists'] },
            message: 'username is already exists!',
        };
    }

    if (password !== confirm) {
        return {
            errors: { username: ['username is already exists'] },
            message: 'password is not matching!',
        };
    }

    try {
        await createUser({ username, password });
    } catch (e) {
        console.log(e);
    }

    redirect('/sign-in');
}
