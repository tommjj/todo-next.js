import type { Metadata, ResolvingMetadata } from 'next';
import TaskList from '@/components/ui/task/task-list';
import CreateTaskForm from '@/components/ui/task/create-task';
import ToolBar from '@/components/ui/task/tool-bar';
import { getListById } from '@/lib/services/list.service';
import { notFound } from 'next/navigation';
import FetchList from '@/components/store/fetch-list';
import { getSessionUser } from '@/lib/auth';

type Props = { params: { board: string } };

export async function generateMetadata(
    { params }: Props,
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
            <ToolBar list={list} />
            <div className="flex flex-col w-full overflow-y-hidden flex-grow">
                <div className="px-3 lg:px-5 lg:pt-2">
                    <CreateTaskForm listId={list.id} />
                </div>

                <FetchList id={list.id} />
                <TaskList />
            </div>
        </>
    );
}

export default Page;
