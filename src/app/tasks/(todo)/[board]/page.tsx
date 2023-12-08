import { getList } from '@/lib/data';
import { notFound } from 'next/navigation';

async function Page({ params }: { params: { board: string } }) {
    const [list, error] = await getList(params.board);

    if (error) notFound();

    return <h1>{JSON.stringify(list)}</h1>;
}

export default Page;
