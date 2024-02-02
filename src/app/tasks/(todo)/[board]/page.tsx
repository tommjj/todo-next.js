import type { Metadata, ResolvingMetadata } from 'next';
import TaskList from '@/components/ui/task/task-list';
import CreateTaskForm from '@/components/ui/task/create-task';
import ToolBar from '@/components/ui/task/tool-bar';
import { getList, getTask } from '@/lib/data';
import { notFound } from 'next/navigation';
import FetchList from '@/components/store/fetch-list';

type Props = { params: { board: string } };

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.board;
    const [list, error] = await getList(id, { name: true });

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
    const [list, error] = await getList(params.board, { id: true, name: true });

    if (error) notFound();

    return (
        <>
            <ToolBar list={list} />
            <div className="flex flex-col  w-full overflow-y-hidden flex-grow">
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
