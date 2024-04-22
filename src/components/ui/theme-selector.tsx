'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Button from './button';

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
        <Button
            variant="ghost"
            className="flex justify-start w-full px-3 py-2 items-center"
            onClick={onClick}
        >
            <CheckIcon className={`h-5 mr-3 ${active || 'opacity-0'}`} />
            {label}
        </Button>
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
        <div className="w-full text-[#333] font-light text-sm overflow-hidden rounded-md">
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
