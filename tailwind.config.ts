import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/ui/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            keyframes: {
                loaded: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                open: {
                    '0%': { transform: 'scale(0.4)' },
                },
            },
            animation: {
                open: 'open .075s ease-in-out',
                loaded: 'loaded .15s ease-in-out',
            },
        },
    },
    plugins: [],
};
export default config;
