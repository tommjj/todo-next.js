import Avatar from '@/components/avatar';
import { Months } from '@/lib/utils';
import { CommentAPIResType } from '@/lib/zod.schema';

const date = new Date();

function getTimeInHM(date = new Date()) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export const CommentItem = ({ comment }: { comment: CommentAPIResType }) => {
    return (
        <div className="flex w-full py-2">
            <div>
                <Avatar
                    className="w-[1.8rem] h-[1.8rem]"
                    name={comment.User.name}
                />
            </div>
            <div className="flex-grow text-[0.82rem]">
                <div>
                    <span className="font-medium mr-2">
                        {comment.User.name}
                    </span>
                    <span className="font-light opacity-70">
                        {`${comment.createAt.getDate()} ${
                            Months[comment.createAt.getMonth()]
                        } ${
                            comment.createAt.getFullYear() !==
                            date.getFullYear()
                                ? comment.createAt.getFullYear()
                                : ''
                        } ${getTimeInHM(comment.createAt)}`}
                    </span>
                </div>
                <div className="">{comment.text}</div>
            </div>
        </div>
    );
};
