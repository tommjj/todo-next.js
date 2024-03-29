import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { getSessionUser } from '../auth';

const factory = createFactory();

export const auth = factory.createMiddleware(async (c, next) => {
    const user = await getSessionUser();

    if (!user) throw new HTTPException(401, { message: 'require auth' });

    c.set('user', user);
    await next();
});
