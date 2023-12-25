import type { Metadata, ResolvingMetadata } from 'next';
import SetList from '@/components/store/set-list';
import TaskList from '@/components/ui/task/task-list';
import CreateTaskForm from '@/components/ui/task/create-task';
import ToolBar from '@/components/ui/task/tool-bar';
import { getList, getTask } from '@/lib/data';
import { notFound } from 'next/navigation';

type Props = { params: { board: string }; searchParams?: { details?: string } };

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.board;
    const [list, error] = await getList(id, { name: true });

    if (error)
        return {
            title: 'not found',
        };

    let title = list.name;

    if (searchParams?.details) {
        const [task] = await getTask(searchParams.details, {
            title: true,
        });

        if (task) {
            title = `${task.title} - ${title}`;
        }
    }

    return {
        title,
    };
}

async function Page({ params }: Props) {
    const [list, error] = await getList(params.board);

    if (error) notFound();

    return (
        <>
            <ToolBar list={list} />
            <div className="flex flex-col px-3 md:p-5 w-full overflow-hidden flex-grow">
                <CreateTaskForm listId={list.id} />
                <SetList list={list} />
                <TaskList />
            </div>
        </>
    );
}

export default Page;
