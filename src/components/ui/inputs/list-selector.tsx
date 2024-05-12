'use client';

import useStore from '@/lib/stores/index.store';
import Button from '../button';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ListWithoutTasksType } from '@/lib/zod.schema';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRef,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import { IoMdArrowDropdown } from 'react-icons/io';
import { buttonActiveClassName, buttonProps } from '../nav/nav-buttons';
import { cn } from '@/lib/utils';
import { GoHash, GoInbox } from 'react-icons/go';
import { RiAddFill } from 'react-icons/ri';

const ListSelector = ({
    defaultValue,
    onChanged = () => {},
    className,
}: {
    className?: string;
    defaultValue?: ListWithoutTasksType;
    onChanged?: (list: ListWithoutTasksType) => void;
}) => {
    const primaryList = useStore((s) => s.primary)!;
    const lists = useStore((s) => s.lists);
    const addListSync = useStore((s) => s.addListSync);

    const [state, setState] = useState(defaultValue || primaryList);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<DropdownMenuRef>(null);

    const handleSetList = useCallback(
        (list: ListWithoutTasksType) => {
            setState(list);
            onChanged(list);
        },
        [onChanged]
    );

    const listFitter = useMemo(
        () =>
            [primaryList, ...lists].filter((list) =>
                list.name
                    .toLocaleLowerCase()
                    .trim()
                    .match(inputValue.toLocaleLowerCase().trim())
            ),
        [inputValue, lists, primaryList]
    );

    const createListHandle = useCallback(async () => {
        const list = await addListSync({ name: inputValue.trim() });
        if (list) handleSetList(list);
    }, [addListSync, handleSetList, inputValue]);

    return (
        <div>
            <DropdownMenu
                onOpen={() => {
                    setTimeout(() => {
                        inputRef.current?.focus();
                    });
                }}
                onClose={() => {
                    setTimeout(() => {
                        setInputValue('');
                    });
                }}
                ref={dropdownRef}
            >
                <DropdownMenuTrigger>
                    <Button
                        variant="ghost"
                        className="text-[0.8rem] py-[0.35rem] px-2 font-medium opacity-80"
                    >
                        <div>
                            {primaryList.id === state.id ? (
                                <GoInbox className="w-4 h-4 p-[2px] mr-1 text-[#444] dark:text-inherit" />
                            ) : (
                                <GoHash className="w-4 h-4 p-[2px] mr-1 text-[#444] dark:text-inherit" />
                            )}
                        </div>
                        {state?.name}{' '}
                        <IoMdArrowDropdown className="w-[0.8rem] h-[0.8rem] ml-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="w-[242px] rounded overflow-hidden bg-main-bg-color dark:bg-main-bg-color-dark">
                        <div
                            className="border-b p-2 px-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                className="w-full outline-none placeholder:font-light text-[0.9rem] bg-inherit font-light"
                                placeholder="Type a list name"
                                name="list-name"
                                type="text"
                                autoComplete="off"
                                autoCapitalize="off"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                ref={inputRef}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === 'Enter' &&
                                        inputValue.trim() !== ''
                                    ) {
                                        if (listFitter.at(0)) {
                                            handleSetList(listFitter.at(0)!);
                                        } else {
                                            createListHandle();
                                        }
                                        setTimeout(() =>
                                            dropdownRef.current?.handleClose()
                                        );
                                    }
                                }}
                            />
                        </div>
                        {inputValue.trim() === '' ? (
                            <div>
                                <div className="px-1 my-1">
                                    <Button
                                        {...buttonProps}
                                        type="button"
                                        className={cn(
                                            buttonProps.className,
                                            'text-[0.8rem] font-normal',
                                            {
                                                [buttonActiveClassName]:
                                                    primaryList.id === state.id,
                                            }
                                        )}
                                        onClick={() =>
                                            handleSetList(primaryList)
                                        }
                                    >
                                        <GoInbox className="w-4 h-4 p-[2px] mr-1 text-[#444] dark:text-inherit" />
                                        Todo
                                    </Button>
                                </div>
                                <div className="px-1.5 text-[0.8rem] font-normal mt-1.5 mb-0.5 opacity-90">
                                    My lists
                                </div>
                                <div className="px-1 ">
                                    {lists.map((list) => (
                                        <Button
                                            key={list.id}
                                            {...buttonProps}
                                            type="button"
                                            className={cn(
                                                buttonProps.className,
                                                'text-[0.8rem] font-normal',
                                                {
                                                    [buttonActiveClassName]:
                                                        list.id === state.id,
                                                }
                                            )}
                                            onClick={() => handleSetList(list)}
                                        >
                                            <GoHash className="w-4 h-4 p-[2px] mr-1 text-[#444] dark:text-inherit" />
                                            {list.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="px-1 my-1">
                                {listFitter.map((list) => (
                                    <Button
                                        key={list.id}
                                        {...buttonProps}
                                        type="button"
                                        className={cn(
                                            buttonProps.className,
                                            'text-[0.8rem] font-normal',
                                            {
                                                [buttonActiveClassName]:
                                                    list.id === state.id,
                                            }
                                        )}
                                        onClick={() => handleSetList(list)}
                                    >
                                        {primaryList.id === state.id ? (
                                            <GoInbox className="w-4 h-4 p-[2px] mr-1 text-[#444] dark:text-inherit" />
                                        ) : (
                                            <GoHash className="w-4 h-4 p-[2px] mr-1 text-[#444] dark:text-inherit" />
                                        )}
                                        {list.name}
                                    </Button>
                                ))}

                                {listFitter.length === 0 && (
                                    <Button
                                        {...buttonProps}
                                        type="button"
                                        className={cn(
                                            buttonProps.className,
                                            'text-[0.8rem] font-normal'
                                        )}
                                        onClick={createListHandle}
                                    >
                                        <RiAddFill className="w-4 h-4 mr-1 text-[#444] dark:text-inherit" />

                                        {inputValue}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ListSelector;
