import { Hono } from 'hono';
import list from './list.router';
import subtask from './subtask.route';

const router = new Hono();

router.route('/lists', list);

router.route('/subtask', subtask);

export default router;
