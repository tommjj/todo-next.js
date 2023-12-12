'use server';

import { z } from 'zod';
import { createUser, getUser } from '@/lib/data';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { getSessionUser } from './auth';
import db from './db';
import { revalidatePath } from 'next/cache';

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

export async function signInAction(
    privState: string | undefined,
    formData: FormData
) {
    try {
        await signIn('credentials', Object.fromEntries(formData));
    } catch (error) {
        if ((error as Error).message.includes('CredentialsSignin')) {
            return 'CredentialSignin';
        }
        throw error;
    }
    return undefined;
}

export async function createList(formData: FormData) {
    const user = await getSessionUser();

    if (!user) return;

    const listParse = z
        .object({
            listName: z.string(),
        })
        .safeParse(Object.fromEntries(formData));

    if (!listParse.success) return;

    await db.list.create({
        data: {
            name: listParse.data.listName,
            userId: user.id,
        },
    });
    revalidatePath('/tasks', 'layout');
}
