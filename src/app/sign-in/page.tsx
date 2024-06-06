import Logo from '@/components/logo';
import SignInForm from '@/components/signin/signin-form';
import Header from '@/components/ui/header/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign in',
    description: 'todo next app',
};

function SignInPage() {
    return (
        <div className="relative h-screen min-h-screen bg-main-bg-color dark:bg-main-bg-color-dark">
            <Header
                className="fixed top-0 left-0 md:px-4 lg:px-6 z-50 h-14"
                showUserInformation={false}
            >
                <Logo />
                <div></div>
            </Header>
            <main className="relative z-10 flex w-full h-screen justify-center items-center">
                <SignInForm />
            </main>
        </div>
    );
}

export default SignInPage;
