"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/Button/page";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/Textarea";
import { Label } from "../ui/Label";

const ContactForm = ({ onBack }: { onBack: () => void }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        message: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Form submitted successfully!");
        setFormData({
            name: "",
            email: "",
            contactNumber: "",
            message: "",
        });
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left Content - Contact Form */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                            <ArrowLeft className="mr-2 w-5 h-5" />
                            Back
                        </button>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-900 leading-tight">Contact Us</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Benjamin Addison Azani"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="addisondestruction@gmail.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                                Contact Number
                            </Label>
                            <Input
                                id="contactNumber"
                                name="contactNumber"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Enter your message here..."
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                        >
                            Submit form
                        </Button>
                    </form>
                </div>

                {/* Right Illustration */}
                <div className="flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-lg">
                        <Image
                            src="/images/contact-form.svg"
                            alt="Person working at desk with laptop and communication icons"
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
};

export default ContactForm;