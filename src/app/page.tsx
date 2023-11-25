import Button from '@/components/ui/button';
import Header from '@/components/ui/header';
import { ArrowSmallRightIcon } from '@heroicons/react/24/solid';

export default function Home() {
    return (
        <>
            <Header className="backdrop-blur-3xl sticky top-0 left-0 px-1 md:h-14 md:px-4 lg:px-6" />
            <main className="min-h-screen bg-gradient-to-br from-white to-90% to-[#e9eaf0] overflow-hidden -mt-14 dark:from-[#09001B] dark:to-[#040130]">
                <section className="relative z-20 flex w-full h-screen overflow-hidden">
                    <div className="flex relative z-10 items-center lg:items-start flex-col text-center lg:text-left justify-center w-full lg:w-1/2 h-full">
                        <div className="relative pb-12  pt-32 lg:pt-0 flex flex-col justify-around h-full lg:h-auto lg:block w-full p-4 lg:pb-4 lg:pl-10 max-w-[670px]">
                            <div></div>
                            <div>
                                <h1 className="text-6xl tracking-tight lg:mt-0 text-[#222] dark:text-white font-semibold lg:top-0 md:text-6xl md:font-semibold lg:text-7xl">
                                    TODO APP
                                </h1>
                                <p className="font-medium mb-14 lg:mb-0 text-[#333] dark:text-white text-xl md:text-2xl">
                                    Welcome to the ToDo App!
                                </p>

                                <p className="px-10 tracking-tight max-w-[340px] mx-auto sm:max-w-none sm:text-base lg:px-0 lg:text-base mt-7 lg:mt-10 lg:w-12/12 text-[#333] dark:text-white">
                                    Your Perfect Assistant for Daily Task
                                    Management!
                                    <span className="p-0 sm:inline">
                                        {' '}
                                        With us, you can effortlessly create,
                                        organize, and efficiently track your
                                        to-do lists. We make managing your daily
                                        tasks a breeze.
                                    </span>
                                </p>
                            </div>

                            <div className="flex justify-center mb-5 lg:mb-0 lg:justify-start relative w-full mt-3">
                                <Button
                                    variant="primary"
                                    className="group w-32 lg:w-36 pl-7"
                                >
                                    START
                                    <ArrowSmallRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute h-14 z-0 lg:z-20 w-full bottom-0 lg:static lg:flex lg:items-center lg:justify-end lg:w-1/2 lg:h-full ">
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
                                            style={{
                                                stopColor: '#6ca1f0',
                                                stopOpacity: 1,
                                            }}
                                        />
                                        <stop
                                            offset="100%"
                                            style={{
                                                stopColor: '#0D6EFD',
                                                stopOpacity: 1,
                                            }}
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
                <section className="w-screen h-screen"></section>
            </main>
        </>
    );
}
