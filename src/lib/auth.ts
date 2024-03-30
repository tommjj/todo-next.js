import { auth } from '@/auth';
import prisma from './databases/prisma.init';

export async function getSessionUser() {
    const session = await auth();

    const user = session?.user;

    if (!user) return undefined;

    const { name, email, id } = user;

    if (!(name && email)) return undefined;

    return { name, id: id, email: email };
}

export async function checkListBelongToUser(userId: string, listId: string) {
    const list = await prisma.list.findUnique({
        where: { userId: userId, id: listId },
    });

    return Boolean(list);
}
