import { Hono } from 'hono';
import lists from './list.router';
import subtasks from './subtask.route';
import auth from './auth.route';
import tasks from './task.route';
import share from './share.route';
import comments from './comment.route';

const router = new Hono();

router.route('/auth', auth);

router.route('/lists', lists);

router.route('/tasks', tasks);

router.route('/comments', comments);

router.route('/subtasks', subtasks);

router.route('/share', share);

export default router;
