import { Hono } from 'hono';
import {
    createTaskHandler,
    getAllImportantTaskHandler,
} from '@controllers/task.controller';

const task = new Hono();

task.post('/', ...createTaskHandler);

task.get('/important', ...getAllImportantTaskHandler);

export default task;
