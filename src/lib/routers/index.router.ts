import { Hono } from 'hono';
import list from './list.router';

const router = new Hono();

router.route('/lists', list);

export default router;
