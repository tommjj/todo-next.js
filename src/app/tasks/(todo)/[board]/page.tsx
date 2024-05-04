import type { Metadata, ResolvingMetadata } from 'next';
import { findListById } from '@/lib/services/list.service';
import { getSessionUser } from '@/lib/auth';
import { findTaskById } from '@/lib/services/task.service';
import { ListPage } from '@/components/ui/app-page/list-page';
import { TodoPage } from '@/components/ui/app-page/todo-page';

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

    const id = params.board;
    const [list, error] = await findListById(
        { listId: id, userId: user.id },
        { name: true }
    );

    if (error)
        return {
            title: 'not found',
        };

    let title = list.name;

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

async function Page({ params }: Props) {
    let Comp = ListPage;

    if (params.board === 'todo') {
        Comp = TodoPage;
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
