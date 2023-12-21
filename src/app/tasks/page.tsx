import HiddenNav from '@/components/store/hidden-nav';
import CreateListForm from '@/components/ui/create-list/create-list-form';
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

    return (
        <main className="grid min-h-full w-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <HiddenNav />
            <div className="text-center">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Create your first list to get started
                </h1>
                <div className="mt-10 flex items-center justify-center gap-x-6 border px-4 rounded-lg mx-6">
                    <CreateListForm />
                </div>
            </div>
        </main>
    );
}
