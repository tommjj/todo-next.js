'use client';

import { cn } from '@/lib/utils';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import Button from '../button';
import { buttonProps } from '../nav/nav-buttons';
import { IconType } from 'react-icons/lib';
import { ICONS } from '../icon';
import { useRouter } from 'next/navigation';
import Highlighter from 'react-highlight-words';
import useStore from '@/lib/stores/index.store';

const SearchItem = ({
    Icon,
    label,
    searchText,
    onClick,
}: {
    Icon: IconType;
    label: string;
    searchText: string;
    onClick: () => void;
}) => {
    return label
        .toLocaleLowerCase()
        .match(searchText.toLocaleLowerCase().trim()) ? (
        <Button
            {...buttonProps}
            onClick={onClick}
            className={cn(
                buttonProps.className,
                'text-base w-full py-1.5 rounded-none px-3.5'
            )}
        >
            <Icon className="w-5 h-5 p-[1px] mr-3.5 opacity-70" />
            <Highlighter
                highlightClassName="font-semibold text-[#000000] dark:text-[#fff] bg-[#00000000]"
                searchWords={[searchText.toLowerCase()]}
                highlightStyle={{ fontWeight: 'normal' }}
                textToHighlight={label}
                caseSensitive={false}
            />
        </Button>
    ) : null;
};

const ListTitle = ({
    label,
}: {
    label: string;
    children?: React.ReactNode;
}) => {
    return (
        <div>
            <h5 className="px-2 pt-1 font-medium text-[0.8rem] opacity-70 border-t">
                {label}
            </h5>
        </div>
    );
};

const Search = ({ close }: { close?: () => void }) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [searchValue, setSearchValue] = useState('');
    const { push } = useRouter();

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <div className="w-full rounded-md ">
            <div className="flex w-full pt-2.5 pb-2 px-2">
                <CiSearch className="w-6 h-6 p-[1px] ml-1 mr-2 " />
                <textarea
                    ref={ref}
                    onInput={(ev) => {
                        const el = ev.target as HTMLTextAreaElement;

                        el.style.height = '5px';
                        el.style.height = el.scrollHeight + 'px';
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (searchValue.trim()) {
                                push(`/tasks/search?q=${searchValue.trim()}`);
                                close && close();
                            }
                        }
                    }}
                    className={cn(
                        'w-full overflow-hidden h-max resize-none outline-none placeholder:font-light bg-inherit'
                    )}
                    placeholder="Search or type a command..."
                    name="search"
                    autoComplete="off"
                    autoCapitalize="off"
                    rows={1}
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                />
            </div>

            <div className="h-[400px] overflow-x-hidden overflow-y-auto custom-scrollbar">
                <div className="w-full">
                    {searchValue.trim() === '' ? null : (
                        <TaskSearch searchText={searchValue} close={close} />
                    )}

                    {'todo {\n} important {\n} planned'.match(
                        searchValue.toLowerCase().trim()
                    ) ? (
                        <ListTitle label="Navigation" />
                    ) : null}
                    <SearchItem
                        Icon={ICONS['todo']}
                        label="Todo"
                        searchText={searchValue}
                        onClick={() => {
                            push('/tasks/todo');
                            close && close();
                        }}
                    />
                    <SearchItem
                        Icon={ICONS['important']}
                        label="Important"
                        searchText={searchValue}
                        onClick={() => {
                            push('/tasks/important');
                            close && close();
                        }}
                    />
                    <SearchItem
                        Icon={ICONS['planned']}
                        label="Planned"
                        searchText={searchValue}
                        onClick={() => {
                            push('/tasks/planned');
                            close && close();
                        }}
                    />
                    <ListSearch searchText={searchValue} close={close} />
                </div>
            </div>
        </div>
    );
};

const ListSearch = ({
    searchText,
    close,
}: {
    searchText: string;
    close?: () => void;
}) => {
    const lists = useStore((s) => s.lists);
    const { push } = useRouter();

    const listFiltered = useMemo(
        () =>
            lists.filter((list) =>
                list.name.toLowerCase().match(searchText.toLowerCase())
            ),
        [lists, searchText]
    );

    return (
        <>
            {listFiltered.length === 0 ? null : (
                <>
                    <ListTitle label="Lists"></ListTitle>
                    <ul>
                        {listFiltered.map((list) => (
                            <SearchItem
                                key={list.id}
                                Icon={ICONS['list']}
                                label={list.name}
                                searchText={searchText}
                                onClick={() => {
                                    push(`/tasks/${list.id}`);
                                    close && close();
                                }}
                            />
                        ))}
                    </ul>
                </>
            )}
        </>
    );
};

const TaskSearch = ({
    searchText,
    close,
}: {
    searchText: string;
    close?: () => void;
}) => {
    const tasks = useStore((s) => s.tasks);
    const { push } = useRouter();

    const tasksFiltered = useMemo(
        () =>
            tasks.filter((task) =>
                task.title.toLowerCase().match(searchText.toLowerCase())
            ),
        [tasks, searchText]
    );

    return (
        <>
            {tasksFiltered.length === 0 ? null : (
                <>
                    <ListTitle label="Tasks"></ListTitle>
                    <ul>
                        {tasksFiltered.map((task) => (
                            <SearchItem
                                key={task.id}
                                Icon={ICONS['task']}
                                label={task.title}
                                searchText={searchText}
                                onClick={() => {
                                    push(
                                        `/tasks/${task.listId}/?details=${task.id}`
                                    );
                                    close && close();
                                }}
                            />
                        ))}
                    </ul>
                </>
            )}
        </>
    );
};

export default Search;
