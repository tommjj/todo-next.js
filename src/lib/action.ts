'use server';

import { z } from 'zod';

import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { getSessionUser } from './auth';
import prisma from './databases/prisma.init';
import { revalidatePath } from 'next/cache';
import { AccountSchema, CreateTaskSchema } from './zod.schema';
import { createUser, getUserByUsername } from './services/user.service';
import { deleteList, getAllListsBySession } from './services/list.service';
import { deleteTaskById, findTaskById } from './services/task.service';
import jwt from 'jsonwebtoken';

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
    token: string,
    privState: State,
    formData: FormData
) {
    try {
        const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as {
            email?: string;
        };

        if (!decoded?.email) {
            return {};
        }

        const newAccount = Object.fromEntries(formData);

        const validatedFields = AccountSchema.safeParse({
            username: newAccount.username,
            email: decoded.email,
            password: newAccount.password,
            confirm: newAccount.confirm,
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Missing Fields. Failed to Create account!',
            };
        }

        const { username, email, password, confirm } = validatedFields.data;

        const user = await getUserByUsername(username);

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

        const [, err] = await createUser({ username, email, password });

        if (err)
            return {
                message: 'create err',
            };
    } catch (error) {
        return {
            message: 'create token err',
        };
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

export async function signOutAction() {
    await signOut();
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

    const list = await prisma.list.create({
        data: {
            name: listParse.data.listName,
            userId: user.id,
        },
    });

    revalidatePath('/tasks', 'layout');
    redirect(`/tasks/${list.id}`);
}

export async function deleteListAction(listId: string) {
    const [lists, err] = await getAllListsBySession();
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
    const user = await getSessionUser();
    if (!user) return;

    const [task, err] = await findTaskById(
        { taskId: id, userId: user.id },
        { id: true }
    );

    if (!task) return;

    await deleteTaskById(id);
    revalidatePath('/tasks', 'layout');
}
