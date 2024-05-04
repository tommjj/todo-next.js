import Logo from '@/components/logo';
import EmailVerify from '@/components/signup/email';
import SignUpForm from '@/components/signup/signup-form';
import Header from '@/components/ui/header/header';

function SignUpPage() {
    return (
        <div className="relative h-screen min-h-screen bg-nav-bg-color dark:bg-nav-bg-color-dark">
            <Header
                className="fixed top-0 left-0 z-50 md:px-4 lg:px-6"
                showUserInformation={false}
            >
                <Logo />
                <div></div>
            </Header>
            <main className="relative z-10 flex w-full h-screen justify-center items-center">
                <EmailVerify />
            </main>
        </div>
    );
}

export default SignUpPage;
