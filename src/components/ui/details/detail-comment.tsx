'use client';

import { cn } from '@/lib/utils';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Button from '../button';
import { CreateCommentButton } from '../comment/comment-create';
import { CommentsAPIResSchema, CommentsAPIResType } from '@/lib/zod.schema';
import { useFetch } from '@/components/hook';
import { CommentItem } from '../comment/comment-item';
import { fetcher } from '@/lib/http';

const Comment = ({ taskId }: { taskId: string }) => {
    const { data, isLoading } = useFetch<{ data: any }>(
        `/v1/api/tasks/${taskId}/comments`
    );
    const [comments, setComments] = useState<CommentsAPIResType>([]);
    const [isOpen, setIsOpen] = useState(true);

    const toggleList = useCallback(() => setIsOpen((p) => !p), []);

    useLayoutEffect(() => {
        if (!data) return;

        const parse = CommentsAPIResSchema.safeParse(data.data);

        if (parse.success) setComments(parse.data);
    }, [data]);

    const handleDelete = useCallback(async (id: string) => {
        setComments((priv) => priv.filter((comment) => comment.id !== id));
        await fetcher.delete(`/v1/api/comments/${id}`);
    }, []);

    return isLoading ? (
        <div></div>
    ) : (
        <div>
            {comments.length === 0 ? (
                <div className="pl-4">
                    <CreateCommentButton
                        taskId={taskId}
                        onCreated={(data) => {
                            setComments((priv) => [...priv, data]);
                        }}
                    />
                </div>
            ) : (
                <>
                    <Button
                        onClick={toggleList}
                        className="px-0 pt-[5px] pb-[3px] justify-start w-full grow font-medium text-[0.9rem] md:hover:bg-inherit rounded-none opacity-90 hover:opacity-100"
                        variant="ghost"
                    >
                        <div className="p-0 rounded-sm">
                            <IoIosArrowForward
                                className={cn(
                                    'h-6 w-5 pr-1 mt-1 transition-all duration-300 mr-1',
                                    {
                                        'rotate-90': isOpen,
                                    }
                                )}
                            />
                        </div>
                        <span className="opacity-90">Comments</span>
                        <span className="ml-1 px-1 rounded font-light text-[0.8rem]"></span>
                    </Button>

                    <div
                        className={cn(
                            'ml-4 border-t overflow-hidden transition-all h-auto border-gray-100 dark:border-gray-900',
                            { 'max-h-0': !isOpen }
                        )}
                    >
                        {/* <CommentList comments={comments} /> */}
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment.id}>
                                    <CommentItem
                                        comment={comment}
                                        handleDelete={handleDelete}
                                    />
                                </li>
                            ))}
                        </ul>

                        <CreateCommentButton
                            taskId={taskId}
                            onCreated={(data) => {
                                setComments((priv) => [...priv, data]);
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Comment;
