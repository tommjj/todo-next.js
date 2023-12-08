import { auth } from '@/auth';
import db from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export default async function TasksPage() {
    const session = await auth();

    const name = session?.user?.name;

    if (!name) {
        notFound();
    }

    const todo = await db.list.findFirst({
        select: { id: true },
        where: { user: { name: name } },
    });

    if (!todo?.id) {
        notFound();
    }

    redirect(`tasks/${todo.id}`);
}
