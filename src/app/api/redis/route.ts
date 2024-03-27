import redis from '@/lib/data/redis.init';

export const dynamic = 'force-dynamic';

export async function GET() {
    await redis.set('get', Date.now(), 'EX', 10000);

    const value = await redis.get('get');

    return new Response(value, { status: 200 });
}
