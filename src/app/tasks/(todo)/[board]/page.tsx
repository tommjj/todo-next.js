import SetList from '@/components/store/set-list';
import TaskList from '@/components/ui/task/task-list';
import CreateTaskForm from '@/components/ui/task/create-task';
import ToolBar from '@/components/ui/task/tool-bar';
import { getList } from '@/lib/data';
import { notFound } from 'next/navigation';

async function Page({ params }: { params: { board: string } }) {
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
