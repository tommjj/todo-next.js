import Logo from '@/components/logo';
import { Test } from '@/components/session-context';

import Button from '@/components/ui/button';
import Header from '@/components/ui/header';
import UserButton from '@/components/ui/user-button';
import { ArrowSmallRightIcon } from '@heroicons/react/24/solid';

function Introduce() {
    return (
        <section className="snap-always snap-center relative z-20 flex w-full h-screen overflow-hidden">
            <div className="flex relative z-10 items-center lg:items-start flex-col text-center lg:text-left justify-center w-full lg:w-1/2 h-full">
                <div className="relative pb-12  pt-32 lg:pt-0 flex flex-col justify-around sm:justify-center h-full lg:h-auto lg:block w-full p-4 lg:pb-4 lg:pl-10 max-w-[670px]">
                    <div></div>
                    <div>
                        <p className="hidden lg:inline font-normal lg:mb-0 text-[#444] dark:text-white text-xl md:text-base">
                            Welcome to the ToDo App!
                        </p>
                        <h1 className="text-3xl tracking-tighter lg:mt-0 text-[#333] dark:text-white font-semibold lg:top-0 md:text-4xl md:font-semibold lg:text-5xl">
                            Your Perfect Assistant for Daily Task Management!
                        </h1>

                        <p className="px-10 tracking-tight max-w-[340px] mx-auto sm:max-w-none sm:text-base lg:px-0 lg:text-base mt-7 lg:mt-10 lg:w-12/12 text-[#333] dark:text-white ">
                            {' '}
                            With us, you can effortlessly create, organize, and
                            efficiently track your to-do lists. We make managing
                            your daily tasks a breeze.
                        </p>
                    </div>
                    <div></div>
                    <div className="flex justify-center sm:mt-6 mb-5 lg:mb-0 lg:justify-start relative w-full lg:mt-4">
                        <Button
                            href="/sign-up"
                            scroll={false}
                            variant="primary"
                            className="group w-44 lg:w-44 px-7 pl-8 py-2"
                        >
                            Get Started
                            <ArrowSmallRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className=" absolute h-14 z-0 lg:z-20 w-full bottom-0 lg:static lg:flex lg:items-center lg:justify-end lg:w-1/2 lg:h-full ">
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
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <>
            <Header className="h-14 backdrop-blur-xl sticky top-0 left-0 px-1 md:h-16 md:px-4 lg:px-6 ">
                <Logo />
                <UserButton />
            </Header>
            <main className="no-scrollbar snap-mandatory snap-y scroll-smooth min-h-screen max-h-screen overflow-y-auto w-full bg-gradient-to-br from-white to-90% to-[#e9eaf0] -mt-16 dark:from-[#09001B] dark:to-[#040130]">
                <Introduce />
                <section className="snap-always snap-center w-full h-screen"></section>
            </main>
        </>
    );
}
