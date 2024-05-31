import Redis from 'ioredis';

let redis: Redis;

function redisBuilder() {
    const redis = new Redis({
        port: Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASS,
    });

    redis.on('connect', () => {
        console.log('redis connect');
    });

    redis.on('error', (err) => {
        console.log('redis error::', err);
    });
    return redis;
}

if (process.env.NODE_ENV === 'production') {
    redis = redisBuilder();
} else {
    let globalWithRedis = global as typeof globalThis & {
        redis: Redis;
    };
    if (!globalWithRedis.redis) {
        globalWithRedis.redis = redisBuilder();
    }
    redis = globalWithRedis.redis;
}

export default redis;
