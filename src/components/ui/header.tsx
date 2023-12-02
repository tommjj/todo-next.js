'use client';

import Logo from '@/components/logo';
import Button from '@/components/ui/button';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface HeaderProps extends React.AllHTMLAttributes<{}> {
    showUserInformation?: boolean;
}

function Header({ className = '', showUserInformation = true }: HeaderProps) {
    const [isScroll, setScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScroll(document.documentElement.scrollTop > 10);
        };

        const handleWheel = (e: any) => {
            console.log(e.deltaY);
        };

        document.addEventListener('scroll', handleScroll);
        document.addEventListener('wheel', handleWheel);

        return () => {
            document.removeEventListener('scroll', handleScroll);
            document.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <header
            className={`flex items-center justify-between w-screen h-14 z-50 dark:border-[#222] transition-all ${clsx(
                { 'border-y': isScroll }
            )} ${className}`}
        >
            <Logo />
            {showUserInformation && (
                <div className="flex ">
                    <Button
                        href="/sign-in"
                        className="mx-1 py-[6px]"
                        variant="ghost"
                        scroll={false}
                    >
                        sign in
                    </Button>
                    <Button
                        href="/sign-up"
                        className="mx-1 py-[6px]"
                        variant="primary"
                        scroll={false}
                    >
                        sign up
                    </Button>
                </div>
            )}
        </header>
    );
}

export default Header;
