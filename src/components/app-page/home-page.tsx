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
                            Organize your work and life.
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
                                    scroll={false}
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
            {/* <div className=" absolute h-14 z-0 lg:z-20 w-full bottom-0 lg:static lg:flex lg:items-center lg:justify-end lg:w-1/2 lg:h-full ">
                <div
                    className={`absolute w-screen h-[200%] bg-white dark:bg-[#09001B] border top-0 rounded-2xl lg:rotate-45 lg:translate-x-2/4 shadow-md shadow-[#e8e9f0] lg:h-0 lg:right-[-20%] lg:top-2/4  lg:bg-gradient-to-r lg:from-[#f8f7f7] lg:to-90% lg:to-[#ecedf3] lg:rounded-[324px] dark:lg:from-[#09001B] dark:lg:to-[#040130] lg:w-screen lg:pt-[100%] lg:-translate-y-2/4 dark:shadow-gray-500`}
                ></div>
                <div className="lg:flex justify-end relative h-full w-full rounded-l-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        strokeWidth={1.2}
                        viewBox="0 0 24 24"
                        className="h-full lg:h-auto lg:w-9/12"
                    >
                        <defs>
                            <linearGradient
                                id="grad1"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop
                                    offset="0%"
                                    className="[stop-color:#6ca1f0] [stop-opacity:1] dark:[stop-color:#0D6EFD]"
                                />
                                <stop
                                    offset="100%"
                                    className="[stop-color:#0D6EFD] [stop-opacity:1] dark:[stop-color:#0058dc]"
                                />
                            </linearGradient>
                        </defs>
                        <path
                            stroke="url(#grad1)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div> */}
        </section>
    );
}
