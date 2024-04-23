import type { Config } from 'tailwindcss';

const config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/ui/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                'nav-bg-color': '#FAFAFA',
                'nav-bg-color-dark': '#202225',
                'nav-active-color': '#E0E2E5',
                'main-bg-color': '#FFFFFF',
                'main-bg-color-dark': '#24262a', //202225
                'nav-text-color': '#39485E',
                'nav-text-color-dark': '#cbcccd',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
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
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
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
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
