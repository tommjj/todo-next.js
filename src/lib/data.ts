import type { Account } from '@/lib/definitions';
import bcrypt from 'bcrypt';
import db from '@/lib/db';

export async function createUser({ username, password }: Account) {
    const hashPassword = await bcrypt.hash(password, 10);

    try {
        await db.user.create({
            data: {
                name: username,
                password: hashPassword,
                List: {
                    create: {
                        name: 'Todo',
                    },
                },
            },
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function getUser(username: string) {
    try {
        return await db.user.findUnique({ where: { name: username } });
    } catch (error) {
        console.log((error as Error).message);
        return null;
    }
}
