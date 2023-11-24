import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { inter } from '../components/font';
import './globals.css';

export const metadata: Metadata = {
    title: 'TODO',
    description: 'todo next app',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body
                className={`${inter.className} bg-white dark:bg-[#09090B] dark:text-white`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
