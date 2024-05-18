import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/databases/prisma.init';
import { redirect } from 'next/navigation';

type Props = {
    params: {
        id: string;
    };
    searchParams: {
        InvitationTokens?: string;
    };
};

const ErrorPage = (code: number) => {
    return (
        <div className="w-screen h-screen overflow-hidden flex justify-center items-center">
            <h1 className="text-9xl lg:text-[28rem] font-bold text-primary-color">
                {code}
            </h1>
        </div>
    );
};

async function Page({ params, searchParams }: Props) {
    const user = await getSessionUser();

    if (!searchParams.InvitationTokens || !user) return ErrorPage(400);

    try {
        const data = await prisma.list.findUnique({
            select: {
                id: true,
            },
            where: {
                id: params.id,
                shareToken: searchParams.InvitationTokens,

                NOT: {
                    userId: user.id,
                },
            },
        });

        if (!data) throw new Error('not found');

        await prisma.share.create({
            data: {
                userId: user.id,
                listId: params.id,
            },
        });
    } catch (error) {
        return ErrorPage(500);
    }

    redirect(`/tasks/${params.id}`);
    return null;
}

export default Page;
