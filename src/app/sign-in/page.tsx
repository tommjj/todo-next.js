import SignInForm from '@/components/signin/signin-form';
import Header from '@/components/ui/header';

function SignInPage() {
    return (
        <div className="relative h-screen min-h-screen bg-gradient-to-b from-[#fcfcfc] to-[#ffffff] dark:bg-none dark:bg-black">
            <Header className="md:px-4 lg:px-6" showUserInformation={false} />
            <main className="relative flex w-full h-screen justify-center items-center -mt-14">
                <SignInForm />
            </main>
        </div>
    );
}

export default SignInPage;
