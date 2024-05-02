import bcrypt from 'bcrypt';

import type { Account } from '@/lib/definitions';
import prisma from '../databases/prisma.init';
import { User } from '.prisma/client';
import { getTodo } from './list.service';

export async function getUserByUsername(username: string) {
    try {
        return await prisma.user.findUnique({ where: { name: username } });
    } catch (error) {
        console.log((error as Error).message);
        return null;
    }
}

export async function createUser({
    username,
    email,
    password,
}: Account): Promise<[User, undefined] | [undefined, Error]> {
    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hashPassword,
                List: {
                    create: {
                        name: 'Home 🏠',
                    },
                },
            },
        });

        await getTodo({ userId: user.id });

        return [user, undefined];
    } catch (error) {
        return [undefined, error as Error];
    }
}
