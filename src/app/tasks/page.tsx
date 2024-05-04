import CreateListForm from '@/components/ui/lists/create-list-form';
import { redirect } from 'next/navigation';

export default async function TasksPage() {
    redirect(`/tasks/todo`);

    return (
        <main className="grid min-h-full w-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
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
