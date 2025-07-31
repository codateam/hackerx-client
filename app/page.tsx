"use client";
import Image from "next/image";
import { Button } from "@/components/Button/page";
import { NavBar } from "@/components/Navbar/page";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 ">
      {/* Navbar */}
      <NavBar />
      {/* Hero Section */}
      <main className="container mx-auto px-4 justify-center items-center">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative hidden md:block">
            <Image
              src="/images/hero-img.png"
              alt="Student studying illustration"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>

          <div className="space-y-2 md:space-y-4 flex items-center md:items-start justify-center md:justify-start flex-col text-center md:text-start">
            <div className="relative md:my-6">
              <Image
                src="/images/hero-md.png"
                alt="Person working on laptop"
                width={277.33}
                height={208}
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl md:text-6xl font-semibold text-[#0000ff] max-w-md">
              Welcome to QuizMaster
            </h1>
            <p className="text-lg md:text-3xl font-medium text-[#f8c35c] max-w-md">
              Your hub for quizzes and learning
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 pt-1 md:pt-8 justify-center md:justify-end w-full">
              <Button
                href="/sign-up/signup-choice"
                className="bg-[#0000ff] w-full md:w-[163px] h-auto hover:bg-[#0000ff]/90 text-[24px]/[29.05px] font-medium"
              >
                Sign Up
              </Button>
              <Button
                href="/login"
                className="bg-[#0000ff] w-full md:w-[163px] h-auto hover:bg-[#0000ff]/90 text-[24px]/[29.05px] font-medium"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
