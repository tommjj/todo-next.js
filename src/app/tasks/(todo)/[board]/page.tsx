import SetList from '@/components/setList';
import TaskTable from '@/components/ui/task/TaskTable';
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
            <div className="flex flex-col px-3 md:p-5 w-full flex-grow">
                <CreateTaskForm listId={list.id} />
                <SetList list={list} />
                <TaskTable />
            </div>
        </>
    );
}

export default Page;
