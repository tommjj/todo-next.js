import { Hono } from 'hono';
import { createSubTask } from '@controllers/subtask.controller';

const subtask = new Hono();

/*
 * Base path: '/subtask'
 */

subtask.get('/hello', async (c) => {
    return c.text('HELLO');
});

subtask.post('/', ...createSubTask);

export default subtask;
