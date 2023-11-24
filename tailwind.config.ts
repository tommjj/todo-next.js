import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        darkMode: 'class',
        extend: {
            keyframes: {
                spins: {
                    '0%': { transform: 'rotate(0deg)' },
                    '50%': { transform: 'rotate(180deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            animation: {
                'spin-slow': 'spins 10s linear infinite',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
};
export default config;
