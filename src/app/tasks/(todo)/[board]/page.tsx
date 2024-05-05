import type { Metadata, ResolvingMetadata } from 'next';
import { findListById } from '@/lib/services/list.service';
import { getSessionUser } from '@/lib/auth';
import { findTaskById } from '@/lib/services/task.service';
import { ListPage } from '@/components/app-page/list-page';
import { TodoPage } from '@/components/app-page/todo-page';
import { ImportantPage } from '@/components/app-page/important-page';

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
        // case 'planned':
        //     //Comp = TodoPage;
        //     break;
        default:
            Comp = ListPage;
            break;
    }

    return (
        <main className="w-full h-full overflow-y-auto custom-scrollbar">
            {/* <AppHeader
                list={
                    params.board === 'important' || params.board === 'todo'
                        ? undefined
                        : list
                }
            />
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-full max-w-4xl px-3 lg:px-5">
                    <AppTitle />
                    <div className="flex flex-col w-full flex-grow">
                        <div className="">
                            <ListViewCreateTask listId={list.id} />
                        </div>

                        <FetchList id={list.id} />
                        <TaskList />
                    </div>
                </div>
            </div> */}
            <Comp />
        </main>
    );
}

export default Page;
