import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { inter } from '../components/font';

import './globals.css';
import Toaster from '@/components/ui/sonner/sonner';

export const metadata: Metadata = {
    title: 'TODO',
    description: 'todo next app',
};

export default function RootLayout(props: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={`${inter.className} w-full overflow-x-hidden`}>
                <Providers>
                    {props.children}
                    {props.modal}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
