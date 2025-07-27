import Image from "next/image"
import { NavBar } from "@/components/Navbar/page"

export default function AboutPage() {
    return (
        <div className="bg-[#f3f3fb] min-h-screen">
            <NavBar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="space-y-6 text-center lg:text-left">
                        <h1 className="text-5xl font-bold text-black leading-tight">About Us</h1>

                        <h2 className="text-lg md:text-2xl font-semibold text-[#0000FF]">Safe, comprehensive, fast platform</h2>

                        <p className="text-black text-lg md:text-xl leading-relaxed">
                            QuizMaster is an online quiz platform designed for students and teachers. The platform provides a safe,
                            comprehensive, and fast way to create and take quizzes. It is easy to use, and users can access it from
                            anywhere. The platform is designed to be user-friendly and has a simple and intuitive interface. It is
                            also highly customizable, allowing users to create quizzes that are tailored to their specific needs.
                            Additionally, the platform provides real-time feedback and results, making it an ideal tool for students
                            and teachers alike.
                        </p>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-lg">
                            <Image
                                src="/images/about-us.svg"
                                alt="Team collaboration illustration with people working around gears and lightbulb"
                                width={500}
                                height={400}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
