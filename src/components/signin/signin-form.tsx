'use client';

import { signInAction } from '@/lib/action';
import { useFormState, useFormStatus } from 'react-dom';
import Button from '../ui/button';
import Link from 'next/link';
import { useState } from 'react';

function SignInForm({ className }: { className?: String }) {
    const [changed, setChanged] = useState(false);
    const [code, action] = useFormState(signInAction, undefined);

    return (
        <div
            className={`rounded-lg w-full px-4 max-w-[420px] md:px-7 pb-12 pt-4 ${className}`}
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-4xl  font-semibold leading-9 tracking-tight text-[#333] dark:text-white">
                    Sign in
                </h2>
                <div id="error" className="text-red-400 text-center h-4 mt-3">
                    {!changed && code && 'Incorrect username or password!'}
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    onSubmit={() => {
                        setChanged(false);
                    }}
                    action={action}
                    className="space-y-6"
                    aria-describedby="error"
                >
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                        >
                            Username
                        </label>
                        <div className="mt-1">
                            <input
                                autoCapitalize="none"
                                id="username"
                                type="text"
                                name="username"
                                required
                                autoComplete="off"
                                className="block text-lg dark:bg-[#ffffff10] px-2 w-full rounded-md outline-none border-0 py-2 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:leading-6 dark:ring-gray-500 invalid:border-red-600"
                                onChange={() => {
                                    setChanged(true);
                                }}
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
                        <div className="mt-1">
                            <input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                className="block text-lg dark:bg-[#ffffff10] px-2 w-full rounded-md outline-none border-0 py-2 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:leading-6 dark:ring-gray-500 invalid:border-red-600"
                                onChange={() => {
                                    setChanged(true);
                                }}
                            />
                        </div>
                        <div className="text-sm text-right mt-1">
                            <a
                                href="#"
                                className=" font-semibold text-primary-color hover:opacity-90"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <SignInButton />
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
                    Do not have an account?
                    <Link
                        href="/sign-up"
                        className="font-semibold leading-6 text-primary hover:opacity-90"
                    >
                        {' '}
                        create new account
                    </Link>
                </p>
            </div>
        </div>
    );
}

function SignInButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            variant="primary"
            type="submit"
            aria-disabled={pending}
            className="w-full py-2 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
        >
            Sign in
        </Button>
    );
}

export default SignInForm;
