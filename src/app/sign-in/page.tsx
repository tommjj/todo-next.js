import Logo from '@/components/logo';
import SignInForm from '@/components/signin/signin-form';
import Header from '@/components/ui/header';

function SignInPage() {
    return (
        <div className="relative h-screen min-h-screen bg-gradient-to-b from-50% from-white to-[#e9eaf0] dark:from-[#09001B] dark:to-[#040130]">
            <Header
                className="sticky md:px-4 lg:px-6 z-50 h-14"
                showUserInformation={false}
            >
                <Logo />
                <div></div>
            </Header>
            <main className="relative z-10 flex w-full h-screen justify-center items-center -mt-14">
                <SignInForm />
            </main>
        </div>
    );
}

export default SignInPage;
