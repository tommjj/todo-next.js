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
            <div className="flex flex-col p-3 md:p-5 w-full flex-grow">
                <CreateTaskForm />
            </div>
        </>
    );
}

export default Page;
