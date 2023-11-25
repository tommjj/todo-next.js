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
            const html = document.querySelector('html');

            if (!html) return;

            setScroll(html.scrollTop > 10);
        };

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={`flex items-center justify-between w-screen h-14 sticky z-50 dark:border-[#222] transition-all ${clsx(
                { 'border-b-2': isScroll }
            )} ${className}`}
        >
            <Logo />
            {showUserInformation && (
                <div className="flex ">
                    <Button
                        href="/sign-in"
                        className="mx-1 py-[6px]"
                        variant="ghost"
                    >
                        sign in
                    </Button>
                    <Button
                        href="/sign-up"
                        className="mx-1 py-[6px]"
                        variant="primary"
                    >
                        sign up
                    </Button>
                </div>
            )}
        </header>
    );
}

export default Header;
