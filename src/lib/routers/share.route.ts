import { Hono } from 'hono';
import * as c from '@controllers/share.controller';
const share = new Hono();

/*
 * Base path: '/share'
 */

share.get('/lists/:id', ...c.getShareDetails);

share.post('/lists/:id', ...c.createNewShareListToken);

share.delete('/lists/:id/token', ...c.removeShareListToken);

share.delete('/lists/:listId/user/:userId', ...c.removeUserFromShareList);

export default share;
