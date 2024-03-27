import Redis from 'ioredis';

let redis: Redis;

if (process.env.NODE_ENV === 'production') {
    redis = new Redis({
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
} else {
    let globalWithPrisma = global as typeof globalThis & {
        redis: Redis;
    };
    if (!globalWithPrisma.redis) {
        globalWithPrisma.redis = new Redis({
            port: Number(process.env.REDIS_PORT),
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASS,
        });

        globalWithPrisma.redis.on('connect', () => {
            console.log('redis connect');
        });

        globalWithPrisma.redis.on('error', (err) => {
            console.log('redis error::', err);
        });
    }
    redis = globalWithPrisma.redis;
}

export default redis;
