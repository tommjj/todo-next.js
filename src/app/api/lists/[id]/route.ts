import prisma from '@/lib/databases/prisma.init';
import { CreateTaskSchema } from '@/lib/zod.schema';
import { getSessionUser } from '@/lib/auth';
import { findListById } from '@/lib/services/list.service';
import { convertTime } from '@/lib/utils';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getSessionUser();
    if (!user) return new Response(undefined, { status: 401 });

    const [list, err] = await findListById({
        listId: params.id,
        userId: user.id,
    });

    if (list) return Response.json(list, { status: 200 });

    return Response.json({ message: err.message }, { status: 410 });
}
