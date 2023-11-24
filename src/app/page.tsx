import Button from '@/components/ui/button';
import Header from '@/components/ui/header';
import { ArrowSmallRightIcon } from '@heroicons/react/24/solid';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-white to-90% to-[#e9eaf0]">
            <Header className="px-1 md:px-4 lg:px-6" />

            <section className="relative z-20 flex w-full h-screen -mt-14 overflow-hidden">
                <div
                    className={`absolute z-10 w-[500px] bottom-0 right-0 rotate-45 translate-x-2/4 shadow-md shadow-[#e8e9f0] md:right-[-20%] md:top-2/4 bg-gradient-to-r from-[#f8f7f7] to-90% to-[#ecedf3] rounded-full md:rounded-[324px] md:w-screen pt-[100%]  md:-translate-y-2/4  dark:shadow-gray-500`}
                ></div>
                <div className="flex relative z-10 w-full h-full">
                    <div className="flex items-center lg:items-start flex-col text-center lg:text-left justify-center w-full lg:w-1/2 h-full">
                        <div className="relative w-full p-4 lg:pl-10 max-w-[670px]">
                            <h1 className="text-5xl text-[#222] dark:text-white font-medium md:text-6xl md:font-semibold lg:text-7xl">
                                TODO APP
                            </h1>
                            <p className="font-medium text-[#333] dark:text-white text-xl md:text-2xl">
                                Welcome to the ToDo App!
                            </p>
                            <p className="px-3 lg:px-0 lg:text-base mt-7 lg:mt-10 lg:w-12/12 text-[#333] dark:text-white">
                                Your Perfect Assistant for Daily Task
                                Management!
                                <span className="hidden sm:inline">
                                    {' '}
                                    With us, you can effortlessly create,
                                    organize, and efficiently track your to-do
                                    lists. We make managing your daily tasks a
                                    breeze.
                                </span>
                            </p>

                            <div className="flex justify-center lg:justify-start relative w-full mt-3">
                                <Button
                                    variant="primary"
                                    className="group w-32 pl-7"
                                    roundedFull
                                >
                                    START
                                    <ArrowSmallRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className=" hidden lg:flex items-center justify-end lg:w-1/2 h-full">
                        <div className="flex justify-end relative w-full rounded-l-lg repeat-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                strokeWidth={1.2}
                                viewBox="0 0 24 24"
                                className="w-9/12"
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
                </div>
            </section>
        </main>
    );
}
