'use client';

import { Lists } from '@/lib/data';
import useStore from '@/store/store';
import { Bars3Icon, ListBulletIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

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
            className={`flex w-full h-full absolute overflow-hidden top-0 left-0 sm:w-[200px] md:relative lg:w-[290px] border-r ${clsx(
                { hidden: !isOpen }
            )}`}
        >
            <div className="w-[290px] sm:w-full bg-white dark:bg-[#111]  inset-0">
                <div className="h-14 flex items-center px-3">
                    <button onClick={handleToggleNav}>
                        <Bars3Icon className="h-6 cursor-pointer" />
                    </button>
                </div>
                <NavLink lists={lists} />
            </div>
            <div
                className="flex-grow bg-[#00000050] sm:hidden"
                onClick={handleToggleNav}
            ></div>
        </nav>
    );
}

export function NavLink({ lists }: { lists: Lists }) {
    const pathname = usePathname();

    return (
        <ul className="flex flex-col">
            {lists.map((item) => (
                <li key={item.id}>
                    <Link
                        href={`/tasks/${item.id}`}
                        className={`w-full hover:opacity-90 h-12 px-3 flex items-center relative ${clsx(
                            {
                                'bg-[#0D6EFD20] dark:bg-[#ffffff20] before:absolute before:top-0 before:left-0 before:bg-[#0D6EFD] before:h-full before:w-[3px]':
                                    `/tasks/${item.id}` === pathname,
                            }
                        )}`}
                    >
                        <ListBulletIcon className="h-6 mr-2" />
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default Nav;
