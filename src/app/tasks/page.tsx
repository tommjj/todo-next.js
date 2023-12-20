import { auth } from '@/auth';
import { getSessionUser } from '@/lib/auth';
import db from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export default async function TasksPage() {
    const user = await getSessionUser();

    if (!user) {
        notFound();
    }

    const todo = await db.list.findFirst({
        select: { id: true },
        where: { user: { name: user.name } },
    });

    if (todo) {
        redirect(`tasks/${todo.id}`);
    }

    return <h1>create your first list</h1>;
}
