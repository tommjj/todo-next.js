'use client';

import { Lists } from '@/lib/data';
import useStore from '@/store/store';
import {
    Bars3Icon,
    ListBulletIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import CreateListForm from '../create-list/create-list-form';

function Nav({ lists }: { lists: Lists }) {
    const isOpen = useStore((state) => state.isOpenNav);
    const handleToggleNav = useStore((state) => state.handleToggleNav);

    useEffect(() => {
        const handleReSize = (e: any) => {
            console.log(e.target);
        };

        window.addEventListener('resize', handleReSize);

        return () => {
            window.removeEventListener('resize', handleReSize);
        };
    }, []);

    return (
        <nav
            className={`flex w-full h-full absolute overflow-hidden top-0 left-0 md:w-[240px] md:relative lg:w-[290px] border-r ${clsx(
                { hidden: !isOpen }
            )}`}
        >
            <div className="w-[290px] md:w-full bg-white dark:bg-[#111] inset-0">
                <div className="h-14 flex items-center justify-between px-4">
                    <button
                        onClick={handleToggleNav}
                        aria-label="toggle side nav"
                    >
                        <Bars3Icon
                            className="h-6 cursor-pointer"
                            strokeWidth={1}
                        />
                    </button>
                </div>
                <NavLink lists={lists} />
                <div className="h-12 px-4 flex items-center">
                    <CreateListForm />
                </div>
            </div>
            <div
                className="flex-grow bg-[#00000050] md:hidden"
                onClick={handleToggleNav}
            ></div>
        </nav>
    );
}

export function NavItem({
    active,
    list,
}: {
    active: boolean;
    list: { id: string; name: string };
}) {
    return (
        <Link
            href={`/tasks/${list.id}`}
            className={`w-full hover:opacity-90 h-12 pl-4 pr-1 flex items-center justify-between relative ${clsx(
                {
                    'font-light': !active,
                    'bg-[#0D6EFD20] dark:bg-[#ffffff20] before:absolute before:top-0 before:left-0 before:bg-[#0D6EFD] before:h-full before:w-[3px] font-normal':
                        active,
                }
            )}`}
        >
            <div className="flex">
                <ListBulletIcon className="h-6 mr-4 " strokeWidth={1} />
                {list.name}
            </div>
            {active && <EllipsisVerticalIcon className="h-6" strokeWidth={1} />}
        </Link>
    );
}

export function NavLink({ lists }: { lists: Lists }) {
    const pathname = usePathname();

    return (
        <ul className="flex flex-col">
            {lists.map((item) => (
                <li key={item.id}>
                    <NavItem
                        active={`/tasks/${item.id}` === pathname}
                        list={item}
                    />
                </li>
            ))}
        </ul>
    );
}

export default Nav;
