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
                up: {
                    '0%': {
                        transform: 'translateY(280px)',
                        opacity: '0',
                        height: '0',
                    },
                },
                deflate: {
                    '100%': { height: '0' },
                },
                open: {
                    '0%': { transform: 'scale(0.6)' },
                },
                expand: {
                    '0%': { height: '0', opacity: '0' },
                },
                expandX: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                },
                remove: {
                    '100%': { height: '0', opacity: '0' },
                },
            },
            animation: {
                deflate: 'deflate .3s ease-in-out',
                up: 'up .2s ease-in-out',
                expandX: 'expandX .55s ease-in-out',
                remove: 'remove .07s ease-in-out forwards',
                expand: 'expand .07s ease-in-out',
                open: 'open .07s ease-in-out',
                loaded: 'loaded .15s ease-in-out',
            },
        },
    },
    plugins: [],
};
export default config;
