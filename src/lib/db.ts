import { PrismaClient } from '@prisma/client';

const logs = { log: ['query', 'info'] };

let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    db = new PrismaClient();
} else {
    let globalWithPrisma = global as typeof globalThis & {
        prisma: PrismaClient;
    };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new PrismaClient();
    }
    db = globalWithPrisma.prisma;
}

export default db;
