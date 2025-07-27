"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


// Contact landing component
const ContactLanding = ({ onShowForm }: { onShowForm: () => void }) => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8">
                <h1 className="text-5xl font-bold leading-tight">Contact Us</h1>

                <h2 className="text-3xl font-semibold text-[#0000FF] w-full md:w-[478px]">
                    Got a Question about using QuizMaster?
                </h2>

                <p className="text-xl leading-relaxed w-full md:w-[470px] font-medium">
                    This is a place to start. Find the answers you need from QuizMaster through the support teams
                </p>

                <div className="space-y-4 md:space-y-6">
                    <button
                        onClick={onShowForm}
                        className="inline-flex items-center text-[#0000FF] hover:text-blue-700 font-semibold text-xl group underline underline-offset-2"
                    >
                        Contact Us
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <br />

                    <Link
                        href="/help"
                        className="inline-flex items-center text-[#0000FF] hover:text-blue-700 font-semibold text-xl group underline underline-offset-2"
                    >
                        Help Center
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Right Illustration */}
            <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg">
                    <Image
                        src="/images/contact-support.svg"
                        alt="Customer support representative with headset and chat bubbles"
                        width={585}
                        height={585}
                        className="w-full h-auto"
                        priority
                    />
                </div>
            </div>
        </div>
    </main>
);


export default ContactLanding;