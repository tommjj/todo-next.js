import DetailsContainer from '@/components/ui/details/detail';
import { getList, getTask } from '@/lib/data';
import { Metadata, ResolvingMetadata } from 'next';

type Props = { params: { board: string; id: string } };

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

    if (params?.id) {
        const [task] = await getTask(params.id, {
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

function DetailsPage({ params }: Props) {
    return <DetailsContainer id={params.id} />;
}

export default DetailsPage;
