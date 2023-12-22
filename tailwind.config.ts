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
                    '0%': { transform: 'scale(0.6)' },
                },
                expand: {
                    '0%': { height: '0', opacity: '0' },
                },
                remove: {
                    '100%': { height: '0' },
                },
            },
            animation: {
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
