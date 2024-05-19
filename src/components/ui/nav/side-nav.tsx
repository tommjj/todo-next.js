'use client';

import { useParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavContext } from './nav-context';
import NoSSR from '@/components/NoSSR';
import NavHeader from './nav-header';
import {
    AddTaskButton,
    SearchButton,
    ImportantButton,
    PlannedButton,
    TodoButton,
} from './nav-buttons';
import { ResizeContainer } from '../resize-container';
import { cn } from '@/lib/utils';
import { NavLinks } from './nav-list';
import { NavShareLinks } from './nav-share-list';

function Nav() {
    const { isOpen, width, setWidth, closeNav, openNav, toggleNav } =
        useNavContext();
    const [isSmS, setIsSmS] = useState(false);

    const { board } = useParams();

    useLayoutEffect(() => {
        if (window.innerWidth < 768) {
            setIsSmS(true);
        } else {
            setIsSmS(false);
        }
    }, []);

    useEffect(() => {
        const handleResize = (e: Event) => {
            const target = e.target as Window;

            if (target.innerWidth <= 768) {
                if (!isSmS) {
                    closeNav();
                }
                setIsSmS(true);
            } else {
                if (isSmS) {
                    openNav();
                }
                setIsSmS(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isSmS, closeNav, openNav]);

    useEffect(() => {
        if (isSmS) {
            closeNav();
        }
    }, [isSmS, board, closeNav]);

    return (
        <NoSSR>
            <aside
                className={cn(
                    'flex absolute top-0 left-0 w-full h-full md:relative  md:w-auto ',
                    {
                        'w-0 delay-300 transition-all duration-0': !isOpen,
                    }
                )}
            >
                <ResizeContainer
                    className={cn(
                        'max-w-[416px] bg-nav-bg-color dark:bg-nav-bg-color-dark h-full md:max-w-[416px] z-50',
                        {
                            'max-w-[220px] md:max-w-[220px] -mr-[220px] -translate-x-[220px]':
                                !isOpen,
                        }
                    )}
                    defaultWidth={width}
                    minWidth={220}
                    maxWidth={416}
                    resizeDir="Right"
                    onSizeChanged={setWidth}
                >
                    <nav className={`flex w-full relative `}>
                        <div className="w-full inset-0 ">
                            <NavHeader />

                            <AddTaskButton />
                            <NavItems />
                            <NavLinks />
                            <NavShareLinks />
                        </div>
                    </nav>
                </ResizeContainer>

                <div
                    className={cn(
                        'flex-grow h-full bg-[#00000050] md:hidden z-40 opacity-100 transition-all duration-300',
                        { 'opacity-0': !isOpen }
                    )}
                    onClick={toggleNav}
                ></div>
            </aside>
        </NoSSR>
    );
}
//ImportantButton,PlannedButton, TodoButton
export const NavItems = () => {
    return (
        <ul className="w-full px-[10px]">
            <li>
                <SearchButton />
            </li>
            <li>
                <TodoButton />
            </li>
            <li>
                <ImportantButton />
            </li>
            <li>
                <PlannedButton />
            </li>
        </ul>
    );
};

export default Nav;
