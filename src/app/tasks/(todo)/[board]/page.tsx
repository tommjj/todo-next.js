import type { Metadata, ResolvingMetadata } from 'next';
import TaskList from '@/components/ui/task/task-list';
import CreateTaskForm from '@/components/ui/task/create-task';
import ToolBar from '@/components/ui/task/tool-bar';
import { getListById } from '@/lib/services/list.service';
import { notFound } from 'next/navigation';
import FetchList from '@/components/store/fetch-list';
import { getSessionUser } from '@/lib/auth';
import { getTaskById } from '@/lib/services/task.service';
import { MainHeader } from '@/components/ui/main/main-header';

type Props = {
    params: { board: string };
    searchParams: { details?: string };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const user = await getSessionUser();
    if (!user)
        return {
            title: 'not found',
        };

    const id = params.board;
    const [list, error] = await getListById(
        { listId: id, userId: user.id },
        { name: true }
    );

    if (error)
        return {
            title: 'not found',
        };

    let title = list.name;

    if (searchParams?.details) {
        const [task] = await getTaskById(
            { taskId: searchParams.details, userId: user.id },
            {
                title: true,
            }
        );

        if (task) {
            title = `${task.title} - ${title}`;
        }
    }

    return {
        title,
    };
}

async function Page({ params }: Props) {
    const user = await getSessionUser();
    if (!user) notFound();

    const [list, error] = await getListById(
        { listId: params.board, userId: user.id },
        {
            id: true,
            name: true,
        }
    );

    if (error) notFound();

    return (
        <>
            <MainHeader list={list} />
            <div className="flex flex-col items-center w-full">
                <main className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <ToolBar list={list} />
                    <div className="flex flex-col w-full flex-grow">
                        <div className="">
                            <CreateTaskForm listId={list.id} />
                        </div>

                        <FetchList id={list.id} />
                        <TaskList />
                    </div>
                </main>
            </div>
        </>
    );
}

export default Page;
