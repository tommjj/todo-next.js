'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

function ThemeToggleButton({ className }: { className?: string }) {
    const { systemTheme, theme, setTheme } = useTheme();

    return (
        <button
            className={` flex justify-center w-10 h-10 cursor-pointer items-center border border-gray-400 rounded-md text-black dark:text-white ${
                className || ''
            }`}
            aria-label="toggle theme"
            onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
        >
            {theme === 'dark' ? (
                <MoonIcon className="w-4 h-4 cursor-pointer text-xs" />
            ) : (
                <SunIcon className="w-6 h-6 cursor-pointer" />
            )}
        </button>
    );
}

export default ThemeToggleButton;
