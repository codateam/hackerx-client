"use client";

import ContactForm from "@/components/Contact/ContactForm";
import ContactLanding from "@/components/Contact/ContactLanding";
import { NavBar } from "@/components/Navbar/page";
import { useState } from "react";

export default function ContactPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="min-h-screen bg-[#f3f3fb]">
            <NavBar />

            {showForm ? (
                <ContactForm onBack={() => setShowForm(false)} />
            ) : (
                <ContactLanding onShowForm={() => setShowForm(true)} />
            )}
        </div>
    );
}