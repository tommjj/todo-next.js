import SignUpForm from '@/components/signup/signup-form';
import Header from '@/components/ui/header';

function SignUpPage() {
    return (
        <div className="relative h-screen min-h-screen bg-gradient-to-b from-[#fcfcfc] to-[#ffffff] dark:bg-none dark:bg-black">
            <Header className="md:px-4 lg:px-6" showUserInformation={false} />
            <main className="relative flex w-full h-screen justify-center items-center -mt-14">
                <SignUpForm />
            </main>
        </div>
    );
}

export default SignUpPage;
