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
    DropdownMenuTrigger,
} from '@/components/ui/drop-down-menu/drop-down-menu';
import { signOutAction } from '@/lib/action';
import ThemeSelector from '../theme-selector';
import { cn } from '@/lib/utils';

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
                                priority
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

                <div
                    className={cn(
                        'bg-nav-bg-color dark:bg-nav-bg-color-dark transition-all duration-300',
                        {
                            'translate-x-[3rem] md:translate-x-[3.4rem] bg-main-bg-color dark:bg-main-bg-color-dark':
                                !isOpen,
                        }
                    )}
                >
                    <Button
                        onClick={toggleNav}
                        className="group p-[8px] "
                        variant="ghost"
                        aria-controls="toggle nav"
                    >
                        <BsLayoutSidebar
                            className="w-[17px] h-[17px] text-[#666] group-hover:text-[#333] dark:text-nav-text-color-dark group-hover:dark:text-nav-text-color-dark"
                            strokeWidth={0.005}
                        />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default NavHeader;
