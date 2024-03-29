import hono from 'hono';

declare module 'hono' {
    interface ContextVariableMap {
        user: {
            name: string;
            id: string;
            email: string;
        };
    }
}
