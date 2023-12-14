import ToolBar from '@/components/ui/task/tool-bar';
import { getList } from '@/lib/data';
import { notFound } from 'next/navigation';

async function Page({ params }: { params: { board: string } }) {
    const [list, error] = await getList(params.board);

    if (error) notFound();

    return (
        <>
            <ToolBar list={list} />
            <div className="w-full flex-grow bg-red-300"></div>
        </>
    );
}

export default Page;
