import { getList } from '@/lib/data';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const [list, err] = await getList(params.id);

    if (list) return new Response(JSON.stringify(list), { status: 200 });

    return new Response(`{"message": "${err.message}"}`, { status: 410 });
}
