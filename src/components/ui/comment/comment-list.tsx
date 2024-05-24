'use client';

import { CommentsAPIResType } from '@/lib/zod.schema';
import { CommentItem } from './comment-item';

export const CommentList = ({ comments }: { comments: CommentsAPIResType }) => {
    return (
        <ul>
            {comments.map((comment) => (
                <li key={comment.id}>
                    <CommentItem comment={comment} />
                </li>
            ))}
        </ul>
    );
};
