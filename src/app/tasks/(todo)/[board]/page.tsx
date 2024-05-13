import type { Metadata, ResolvingMetadata } from 'next';
import { findListById } from '@/lib/services/list.service';
import { getSessionUser } from '@/lib/auth';
import { findTaskById } from '@/lib/services/task.service';
import { ListPage } from '@/components/app-page/list-page';
import { TodoPage } from '@/components/app-page/todo-page';
import { ImportantPage } from '@/components/app-page/important-page';
import { PlannedPage } from '@/components/app-page/planned-page';
import { SearchPage } from '@/components/app-page/search-page';

type Props = {
    params: { board: string };
    searchParams: { details?: string };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const user = await getSessionUser();
    if (!user)
        return {
            title: 'not found',
        };

    let title = '';
    switch (params.board) {
        case 'todo':
            title = 'todo';
            break;
        case 'important':
            title = 'important';
            break;
        case 'planned':
            title = 'planned';
            break;
        case 'search':
            title = 'search';
            break;
        default:
            const id = params.board;
            const [list, error] = await findListById(
                { listId: id, userId: user.id },
                { name: true }
            );
            if (error)
                return {
                    title: 'not found',
                };

            title = list.name;
            break;
    }

    if (searchParams?.details) {
        const [task] = await findTaskById(
            { taskId: searchParams.details, userId: user.id },
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

async function Page({ params: { board } }: Props) {
    let Comp;

    switch (board) {
        case 'todo':
            Comp = TodoPage;
            break;
        case 'important':
            Comp = ImportantPage;
            break;
        case 'planned':
            Comp = PlannedPage;
            break;
        case 'search':
            Comp = SearchPage;
            break;
        default:
            Comp = ListPage;
            break;
    }

    return (
        <main className="w-full h-full overflow-y-auto custom-scrollbar">
            <Comp />
        </main>
    );
}

export default Page;
