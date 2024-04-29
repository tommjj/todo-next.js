'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import Button from '../ui/button';
import { buttonProps } from '../ui/nav/nav-buttons';
import { z } from 'zod';
import { fetcher } from '@/lib/http';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '../ui-lib/ui/input-otp';

export const EmailForm = () => {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');

    const handleSubmitEmailClick: React.FormEventHandler<HTMLFormElement> =
        useCallback(
            (e) => {
                e.preventDefault();

                if (z.string().email().safeParse(email).success) {
                    fetcher.post
                        .json('v1/api/auth/email-verify', {
                            email: email,
                        })
                        .then(([res]) => {
                            if (res?.ok) {
                                console.log('ok');
                            }
                        });

                    push(`?email=${email}&otp=true`);
                }
            },
            [email, push]
        );

    return (
        <div className="">
            <form
                className="space-y-5"
                aria-describedby="error"
                onSubmit={handleSubmitEmailClick}
            >
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-800 dark:text-white"
                    >
                        Enter your email
                    </label>
                    <div className="mt-1">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoCapitalize="none"
                            id="Email"
                            placeholder="example@mail.com"
                            type="text"
                            name="email"
                            required
                            autoComplete="off"
                            className="block text-lg dark:bg-[#ffffff10] px-2 w-full rounded-md outline-none border-0 py-2 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:leading-6 dark:ring-gray-500 invalid:border-red-600"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="primary"
                        className="w-full py-2 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                        aria-disabled={
                            !z.string().email().safeParse(email).success
                        }
                    >
                        Continue
                    </Button>
                </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
                Do you already have an account?
                <Link
                    href="/sign-in"
                    className="font-semibold leading-6 text-[#0D6EFD] hover:opacity-90"
                >
                    {' '}
                    Sign in
                </Link>
            </p>
        </div>
    );
};

const OptForm = () => {
    return (
        <div className="">
            <form className="space-y-5" aria-describedby="error">
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-800 dark:text-white"
                    >
                        Enter active code
                    </label>
                    <p className="opacity-60 text-[0.8rem]">
                        A code has been sent to your email
                    </p>

                    <div className="w-full mt-2">
                        <InputOTP maxLength={6}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button
                        type="button"
                        variant="primary"
                        className="w-full py-2 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                    >
                        Verify
                    </Button>
                </div>
                <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
                    Do not get code?
                    <span className="font-semibold leading-6 text-primary-color hover:opacity-90">
                        {' '}
                        resend
                    </span>
                </p>
            </form>
        </div>
    );
};

const EmailVerify = () => {
    const { has } = useSearchParams();

    return (
        <div
            className={`rounded-lg w-full px-4 max-w-[420px] md:px-7 pb-12 pt-4`}
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-[#333] dark:text-white">
                    Sign up
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                {!has('otp') ? <EmailForm /> : <OptForm />}
            </div>
        </div>
    );
};
export default EmailVerify;
