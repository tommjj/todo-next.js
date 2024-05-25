import { Hono } from 'hono';
import * as c from '@controllers/comment.controller';
const comments = new Hono();

/*
 * Base path: '/comments'
 */

comments.post('/', ...c.createCommentHandler);

comments.delete('/:id', ...c.deleteCommentHandler);

export default comments;
