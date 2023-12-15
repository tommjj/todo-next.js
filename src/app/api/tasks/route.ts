import db from '@/lib/db';

export async function GET() {
    await db.miniTask.create({
        data: {
            title: 'dw',
            taskId: 'fc8abf8d-032b-40ef-add3-a3f9bfa0c236',
        },
    });
    return new Response('hello world!', { status: 200 });
}
