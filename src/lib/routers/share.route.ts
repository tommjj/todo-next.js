import { Hono } from 'hono';
import * as shareController from '@controllers/share.controller';
const share = new Hono();

/*
 * Base path: '/share'
 */

share.get('/lists/:id', ...shareController.getShareDetails);

share.post('/lists/:id', ...shareController.createNewShareListToken);

export default share;
