import DetailsContainer from '@/components/ui/details/detail';
import { getSessionUser } from '@/lib/auth';
import { getListById, getTaskById } from '@/lib/service';
import { Metadata, ResolvingMetadata } from 'next';

type Props = { params: { board: string; id: string } };

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

    if (params?.id) {
        const [task] = await getTaskById(
            { taskId: params.id, userId: user.id },
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

function DetailsPage({ params }: Props) {
    return <DetailsContainer id={params.id} />;
}

export default DetailsPage;
