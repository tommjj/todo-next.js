import SignInForm from '@/components/signin/signin-form';
import Modal from '@/components/ui/modal';

function Page() {
    return (
        <SignInForm
            className={
                'h-screen flex justify-center flex-col sm:block sm:h-auto sm:bg-white sm:dark:bg-[#09001B] sm:border dark:border-[#222]'
            }
        />
    );
}

export default Page;
