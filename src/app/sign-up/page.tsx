import SignUpForm from '@/components/signup/signup-form';
import Header from '@/components/ui/header';

function SignUpPage() {
    return (
        <div className="relative h-screen min-h-screen bg-gradient-to-b from-50% from-white to-[#e9eaf0] dark:from-[#09001B] dark:to-[#040130]">
            <Header className="md:px-4 lg:px-6" showUserInformation={false} />
            <main className="relative flex w-full h-screen justify-center items-center -mt-14">
                <SignUpForm />
            </main>
        </div>
    );
}

export default SignUpPage;
