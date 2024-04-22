'use client';

import Image from 'next/image';

import { BsLayoutSidebar } from 'react-icons/bs';
import {
    ArrowLeftOnRectangleIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useSession } from '@/components/session-context';
import Button from '../button';
import { useNavContext } from './nav-context';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/drop-down-menu/drop-down-menu';
import { signOut } from '@/auth';
import { signOutAction } from '@/lib/action';
import ThemeSelector from '../theme-selector';

const NavHeader = () => {
    const { isOpen, toggleNav } = useNavContext();
    const user = useSession();

    return (
        <header className="flex items-center justify-center w-full h-14">
            <div className="flex justify-between w-full m-[0.63rem]">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button className="px-[6px] py-[3px]" variant="ghost">
                            <Image
                                className="w-[26px] mr-2 rounded-full"
                                src="/images/TODO_LOGO.png"
                                alt="logo"
                                width={26}
                                height={26}
                            />
                            <span className="text-sm font-medium">
                                {user?.name}
                            </span>{' '}
                            <ChevronDownIcon className="w-[14px] ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 p-1 dark:border-white">
                        <ThemeSelector />
                        <hr className="dark:border-white my-1" />
                        <form action={signOutAction}>
                            <Button
                                variant="ghost"
                                className="flex w-full py-1 justify-start items-center px-3 text-[#333]"
                                type="submit"
                            >
                                <ArrowLeftOnRectangleIcon className="h-5 mr-3 " />{' '}
                                sign out
                            </Button>
                        </form>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    onClick={toggleNav}
                    className="group p-[8px] "
                    variant="ghost"
                    aria-controls="toggle nav"
                >
                    <BsLayoutSidebar
                        className="w-[17px] h-[17px] text-[#666] group-hover:text-[#333]"
                        strokeWidth={0.005}
                    />
                </Button>
            </div>
        </header>
    );
};

export default NavHeader;
