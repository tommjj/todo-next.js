import Avatar from '@/components/avatar';
import { cn, Months } from '@/lib/utils';
import { CommentAPIResType } from '@/lib/zod.schema';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import Button from '../button';
import { buttonProps } from '../nav/nav-buttons';
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSession } from '@/components/session-context';
import { FaRegEdit } from 'react-icons/fa';

const date = new Date();

function getTimeInHM(date = new Date()) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export const CommentItem = ({
    comment,
    handleDelete,
}: {
    comment: CommentAPIResType;
    handleDelete: (id: string) => void;
}) => {
    const user = useSession();

    return (
        <div className="group flex w-full pb-1 pt-2 animate-expand">
            <div>
                <Avatar
                    className="w-[1.8rem] h-[1.8rem]"
                    name={comment.User.name}
                />
            </div>
            <div className="flex-grow text-[0.82rem]">
                <div className="w-full flex justify-between">
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
                    <div>
                        {user.id === comment.User.id ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            buttonProps.className,
                                            'p-[1px] select-none opacity-0 group-hover:opacity-50 -mt-1'
                                        )}
                                    >
                                        <EllipsisHorizontalIcon className="h-[20px] w-[20px] " />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="transition-all duration-75 p-1">
                                    {/* <Button
                                        // onClick={setEditor}
                                        variant="ghost"
                                        className={cn(
                                            buttonProps.className,
                                            ' w-36 px-3 py-1 flex justify-start items-center font-light mb-1'
                                        )}
                                    >
                                        <FaRegEdit className="h-4 mr-2 opacity-90 mb-[1px]" />
                                        Edit
                                    </Button> */}

                                    <Button
                                        onClick={() => handleDelete(comment.id)}
                                        variant="ghost"
                                        className={cn(
                                            buttonProps.className,
                                            ' w-36 px-3 py-1 text-red-600 flex justify-start items-center font-light'
                                        )}
                                    >
                                        <TrashIcon className="h-4 mr-2" />
                                        Delete
                                    </Button>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : null}
                    </div>
                </div>
                <div className="opacity-90 w-full whitespace-pre-line ">
                    {comment.text}
                </div>
            </div>
        </div>
    );
};
