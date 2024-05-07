import { Hono } from 'hono';
import {
    createTaskHandler,
    getAllImportantTaskHandler,
    getAllPlannedTaskHandler,
} from '@controllers/task.controller';

const task = new Hono();

task.post('/', ...createTaskHandler);

task.get('/important', ...getAllImportantTaskHandler);

task.get('/planned', ...getAllPlannedTaskHandler);

export default task;
