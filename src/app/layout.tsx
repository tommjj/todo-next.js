import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { inter } from '../components/font';

import './globals.css';
import Toaster from '@/components/ui/sonner/sonner';
import { SessionProvider } from '@/components/session-context';
import { auth } from '@/auth';

export const metadata: Metadata = {
    title: 'TODO',
    description: 'todo next app',
};

export default async function RootLayout(props: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    const session = await auth();

    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={`${inter.className} w-full overflow-x-hidden`}>
                <SessionProvider user={session?.user}>
                    <Providers>
                        {props.children}
                        {props.modal}
                        <Toaster />
                    </Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
