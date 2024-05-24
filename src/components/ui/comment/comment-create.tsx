'use client';

import dynamic from 'next/dynamic';

import Avatar from '@/components/avatar';
import { useSession } from '@/components/session-context';
import { cn } from '@/lib/utils';
import { AreaInput, TaskNameInput } from '../inputs/text-input';
import Button from '../button';
import {
    ChangeEvent,
    ChangeEventHandler,
    useCallback,
    useRef,
    useState,
} from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRef,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import { BsEmojiSmile } from 'react-icons/bs';
import { useTheme } from 'next-themes';
import { CommentAPIResType } from '@/lib/zod.schema';

import data from '@emoji-mart/data';

const Picker = dynamic(
    () => {
        return import('@emoji-mart/react');
    },
    { ssr: false }
);

export const CreateComment = ({
    className,
    onCancel = () => {},
}: {
    className?: string;
    onCancel?: () => void;
    onCreated?: (newCom: CommentAPIResType) => void;
}) => {
    const { theme } = useTheme();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const dropDownRef = useRef<DropdownMenuRef>(null);
    const [text, setText] = useState('');
    const user = useSession();

    const handleAddIcon = useCallback((e: any) => {
        // console.log(e);
        setText((priv) => priv + e.native);
        inputRef.current?.focus();
        dropDownRef.current?.handleClose();
    }, []);

    const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> =
        useCallback((e) => {
            setText((priv) => e.target.value);
        }, []);

    return (
        <form
            className={cn(
                'w-full border dark:border-[#FAFAFA] rounded-md',
                className
            )}
        >
            <div className="w-full px-[10px] pt-[10px] min-h-[54px]">
                <AreaInput
                    ref={inputRef}
                    className="text-[0.9rem] font-light"
                    autoComplete="off"
                    autoFocus
                    placeholder="Comment"
                    value={text}
                    onChange={handleTextChange}
                />
            </div>
            <div className="w-full flex justify-between gap-[0.35rem] p-[8px] pt-2 dark:border-[#FAFAFA]">
                <div className="flex items-center">
                    <DropdownMenu ref={dropDownRef}>
                        <DropdownMenuTrigger>
                            <Button
                                variant="outline"
                                className="px-0 py-0 rounded-full"
                            >
                                <BsEmojiSmile className="w-5 h-5 opacity-70" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-none">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Picker
                                    data={data}
                                    onEmojiSelect={handleAddIcon}
                                    perLine={8}
                                    previewPosition="none"
                                    navPosition="bottom"
                                    theme={theme}
                                ></Picker>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-[0.35rem]">
                    <Button
                        type="button"
                        className="text-[0.8rem] py-[0.3rem]"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="text-[0.8rem] py-[0.3rem] aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                        variant="primary"
                        // aria-disabled={formState.title.trim() === ''}
                    >
                        Comment
                    </Button>
                </div>
            </div>
        </form>
    );
};

export const CreateCommentButton = () => {
    const user = useSession();
    const [isActive, setIsActive] = useState(false);

    const handleToggle = useCallback(() => {
        setIsActive((priv) => !priv);
    }, []);

    return isActive ? (
        <CreateComment onCancel={handleToggle} />
    ) : (
        <div className="flex py-2">
            <Avatar className="w-[1.8rem] h-[1.8rem] mr-2" name={user.name} />{' '}
            <div
                onClick={handleToggle}
                className="flex-grow h-[1.8rem] border rounded-full text-gray-400 px-3 text-[0.9rem] flex items-center cursor-pointer border-gray-100 hover:border-gray-200"
            >
                Comment
            </div>
        </div>
    );
};
