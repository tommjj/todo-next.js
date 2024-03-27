import Redis from 'ioredis';

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

export default redis;
