'use client';

import { Lists } from '@/lib/data';
import { Bars3Icon, ListBulletIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Nav({ lists }: { lists: Lists }) {
    return (
        <nav className="w-[290px] h-full absolute top-0 left-0 sm:w-[200px] md:relative lg:w-[290px]">
            <div className="h-14 flex items-center px-3">
                <Bars3Icon className="h-6 cursor-pointer" />
            </div>
            <NavLink lists={lists} />
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
