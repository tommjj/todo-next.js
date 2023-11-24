'use client';

//import { login } from '@/lib/action';
import { useFormState, useFormStatus } from 'react-dom';
import Button from '../ui/button';

function SignUpForm() {
    //const [code, action] = useFormState(login, undefined);
    const { pending } = useFormStatus();

    return (
        <div className="flex p-5 min-h-full w-full flex-col justify-center items-center px-6 py-12 lg:px-8 ">
            <div className="rounded-lg w-full md:border max-w-[420px]  md:px-7 pb-12 pt-4 dark:border-none">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                        Sign in
                    </h2>
                    <div
                        id="error"
                        className="text-red-400 text-center h-4 mt-3"
                    >
                        {/* {code && 'Incorrect username or password!'} */}
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        // action={action}
                        className="space-y-5"
                        aria-describedby="error"
                    >
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    required
                                    autoComplete="off"
                                    className="block px-2 w-full rounded-md outline-none border-0 py-1.5 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D6EFD] sm:text-sm sm:leading-6 dark:ring-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="block px-2 w-full outline-none rounded-md border-0 py-1.5 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D6EFD] sm:text-sm sm:leading-6 dark:ring-gray-500"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="confirm"
                                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                                >
                                    Confirm password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="confirm"
                                    type="password"
                                    name="confirm"
                                    className="block px-2 w-full outline-none rounded-md border-0 py-1.5 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D6EFD] sm:text-sm sm:leading-6 dark:ring-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                variant="primary"
                                type="submit"
                                aria-disabled={pending}
                                className="w-full aria-disabled:opacity-75 mt-12 py-1.5 text-sm font-semibold leading-6 shadow-s focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D6EFD]"
                            >
                                Sign up
                            </Button>
                        </div>
                    </form>
                    <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
                        Do you already have an account?
                        <a
                            href="/sign-up"
                            className="font-semibold leading-6 text-[#0D6EFD] hover:opacity-90"
                        >
                            {' '}
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;
