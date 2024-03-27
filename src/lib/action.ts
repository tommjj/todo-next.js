'use server';

import { z } from 'zod';
import {
    createTask,
    createUser,
    deleteList,
    deleteTask,
    getLists,
    getTask,
    getUser,
} from '@/lib/data/';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { getSessionUser } from './auth';
import db from './db/prisma.init';
import { revalidatePath } from 'next/cache';
import { AccountSchema, CreateTaskSchema } from './zod.schema';

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

export async function createListAction(formData: FormData) {
    const user = await getSessionUser();
    if (!user) return;

    const listParse = z
        .object({
            listName: z.string().min(1).max(30),
        })
        .safeParse(Object.fromEntries(formData));

    if (!listParse.success) return;

    const list = await db.list.create({
        data: {
            name: listParse.data.listName,
            userId: user.id,
        },
    });

    revalidatePath('/tasks', 'layout');
    redirect(`/tasks/${list.id}`);
}

export async function deleteListAction(listId: string) {
    const [lists, err] = await getLists();
    if (err) return;

    const deleteListIndex = lists.findIndex((e) => e.id === listId);
    if (deleteListIndex === -1) return;

    const deleteErr = await deleteList(listId);

    if (deleteErr) {
        console.log(deleteErr);
    }

    revalidatePath('/tasks', 'layout');

    if (lists.length === 1) redirect(`/tasks`);

    redirect(
        `/tasks/${lists[deleteListIndex === 0 ? 1 : deleteListIndex - 1].id}`
    );
}

export async function deleteTaskAction(id: string) {
    const [task, err] = await getTask(id, { id: true });

    if (!task) return;

    await deleteTask(id);
    revalidatePath('/tasks', 'layout');
}
