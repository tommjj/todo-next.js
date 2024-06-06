import Hero from '@/components/app-page/home-page';
import Logo from '@/components/logo';

import Header from '@/components/ui/header/header';
import UserButton from '@/components/ui/user-button';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'TODO',
    description: 'todo next app',
};

export default function Home() {
    return (
        <>
            <Header className="h-14 backdrop-blur-xl sticky top-0 left-0 px-1 md:h-16 md:px-4 lg:px-6 ">
                <Logo />
                <UserButton />
            </Header>
            <main className="no-scrollbar snap-mandatory snap-y scroll-smooth min-h-screen max-h-screen overflow-y-auto w-full -mt-16 bg-main-bg-color dark:bg-main-bg-color-dark">
                <Hero />
                <section className="snap-always snap-center w-full h-screen pt-[600px]"></section>
            </main>
        </>
    );
}
