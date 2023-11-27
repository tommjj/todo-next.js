import Modal from '@/components/ui/modal';
import SignUpFrom from '@/components/signup/signup-form';

export default function SignUp() {
    return (
        <SignUpFrom
            className={
                'h-screen flex justify-center flex-col sm:block sm:h-auto sm:bg-white sm:dark:bg-[#09001B] sm:border dark:border-[#222]'
            }
        />
    );
}
