import Image from "next/image";
import { NavBar } from "@/components/Navbar/page";

export default function AboutPage() {
  return (
    <div className="bg-[#f3f3fb] min-h-screen">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-5xl font-bold text-black leading-tight">
              About Chachi
            </h1>

            <h2 className="text-lg md:text-2xl font-semibold text-[#0000FF]">
              Safe, comprehensive, fast platform
            </h2>

            <p className="text-black text-lg md:text-xl leading-relaxed">
              Chachi is an AI-powered learning management system designed for
              schools and organizations to make education more accessible and
              inclusive. By eliminating language barriers, Chachi allows
              teachers to upload learning materials in their preferred language
              while enabling students to seamlessly read and interact with the
              content in their own native language. The platform also ensures a
              consistent and user-friendly approach to assessments, promoting a
              more effective and equitable learning experience for all.
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
  );
}
