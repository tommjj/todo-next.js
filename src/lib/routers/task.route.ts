import { Hono } from 'hono';
import { createTaskHandler } from '@controllers/task.controller';

const task = new Hono();

task.post('/', ...createTaskHandler);

export default task;
