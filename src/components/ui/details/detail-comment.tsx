'use client';

import { cn } from '@/lib/utils';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Button from '../button';
import { CreateCommentButton } from '../comment/comment-create';
import { CommentsAPIResSchema, CommentsAPIResType } from '@/lib/zod.schema';
import { useFetch } from '@/components/hook';
import { CommentList } from '../comment/comment-list';

const Comment = ({ taskId }: { taskId: string }) => {
    const { data } = useFetch<{ data: any }>(
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

    return (
        <div>
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
            </>
            <div
                className={cn(
                    'ml-4 border-t overflow-hidden transition-all h-auto border-gray-100 dark:border-gray-900'
                )}
                // style={{
                //     maxHeight: `${
                //         isOpen ? 60 * (1 + subtasks.length) + 100 : 0
                //     }px`,
                // }}
            >
                <CommentList comments={comments} />

                <CreateCommentButton />
            </div>
        </div>
    );
};

export default Comment;
