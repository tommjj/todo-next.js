import { Hono } from 'hono';
import list from './list.router';
import subtasks from './subtask.route';

const router = new Hono();

router.route('/lists', list);

router.route('/subtasks', subtasks);

export default router;
