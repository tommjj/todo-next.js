'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

function SelectItem({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: React.MouseEventHandler;
}) {
    return (
        <button
            className="flex w-full px-3 py-2 items-center hover:bg-gray-100 dark:hover:bg-[#111] dark:text-white"
            onClick={onClick}
        >
            <CheckIcon className={`h-5 mr-3 ${active || 'opacity-0'}`} />
            {label}
        </button>
    );
}

function ThemeSelector() {
    const { theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<undefined | string>(
        undefined
    );

    useEffect(() => {
        setCurrentTheme(theme);
    }, [theme]);

    return (
        <div className="w-44 text-[#333] font-light text-sm overflow-hidden rounded-md">
            <SelectItem
                onClick={() => {
                    setTheme('system');
                }}
                active={currentTheme === 'system'}
                label="Use device theme"
            />
            <SelectItem
                onClick={() => {
                    setTheme('light');
                }}
                active={currentTheme === 'light'}
                label="Use light theme"
            />
            <SelectItem
                onClick={() => {
                    setTheme('dark');
                }}
                active={currentTheme === 'dark'}
                label="Use dark theme"
            />
        </div>
    );
}

export default ThemeSelector;
