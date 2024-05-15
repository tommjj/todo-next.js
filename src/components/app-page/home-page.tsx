'use client';

import { ArrowSmallRightIcon } from '@heroicons/react/24/outline';
import Button from '../ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Introduce() {
    const [email, setEmail] = useState('');
    const { push } = useRouter();

    return (
        <section className="snap-always snap-center relative z-20 flex w-full h-screen overflow-hidden">
            <div className="flex relative z-10 items-start flex-col lg:text-left justify-center w-full lg:w-full h-full">
                <div className="relative pb-12  pt-32 lg:pt-0 flex flex-col justify-center h-full lg:h-auto lg:block w-full p-4 lg:pb-4 md:px-12 lg:px-24">
                    <div></div>
                    <div>
                        <h1 className="text-5xl tracking-tighter lg:mt-0 text-[#333] dark:text-white font-semibold lg:top-0 md:text-6xl md:font-semibold lg:text-[4.8rem] lg:-ml-1 leading-none">
                            Organize your work and life
                        </h1>

                        <p className="tracking-tight max-w-[340px] sm:max-w-none text-xl sm:text-2xl lg:px-0 mt-7 lg:mt-3 text-[#666] dark:text-white ">
                            A task manager you can trust for life
                        </p>
                    </div>
                    <div></div>
                    <div className="flex justify-center mt-7 mb-5 lg:mb-0 lg:justify-start relative w-full lg:mt-10 sm:max-w-[640px]">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                push(`/sign-up?email=${email}`);
                            }}
                            className="flex flex-col sm:flex-row w-full"
                        >
                            <input
                                className="flex-grow block text-lg dark:bg-[#ffffff10] px-2 w-full rounded-md sm:rounded-none sm:rounded-s-md outline-none border-0 py-2.5 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:leading-6 dark:ring-gray-500 invalid:border-red-600"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>
                            <div>
                                <Button
                                    variant="primary"
                                    className="mt-4 sm:mt-0 h-12 w-full flex-shrink flex-grow-0 group sm:w-44 px-7 pl-8 py-2 sm:rounded-none sm:rounded-r-md"
                                >
                                    Get Started
                                    <ArrowSmallRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
