'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface HeaderProps extends React.AllHTMLAttributes<{}> {
    showUserInformation?: boolean;
}

function Header({ className = '', children }: HeaderProps) {
    const [isScroll, setScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScroll(document.documentElement.scrollTop > 10);
        };

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={`flex items-center justify-between w-full z-50 dark:border-[#222] transition-all ${clsx(
                { 'border-y': isScroll }
            )} ${className}`}
        >
            {children}
        </header>
    );
}

export default Header;
