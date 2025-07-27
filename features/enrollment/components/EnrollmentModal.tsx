"use client";
import { useState } from "react";
import { Button } from "@/components/Button/page";
import { toast } from "react-toastify";
import { Course } from "@/types/course";
import { z } from "zod";
import { EnrollmentCreateSchema } from "../lib/validation";
import { createEnrollment } from "../api";

interface EnrollmentModalProps {
    course: Course;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const EnrollmentModal = ({ course, isOpen, onClose, onSuccess }: EnrollmentModalProps) => {
    const [formData, setFormData] = useState({
        level: "",
        semester: "First" as "First" | "Second",
        session: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = EnrollmentCreateSchema.parse({
                course: course.id || course._id,
                level: formData.level,
                semester: formData.semester,
                session: formData.session,
            });

            setIsSubmitting(true);
            const result = await createEnrollment(validatedData);

            if (result.success) {
                toast.success(result.message);
                onSuccess();
                onClose();
                setFormData({ level: "", semester: "First", session: "" });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Enroll in Course</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900">{course.code}</h3>
                    <p className="text-blue-700">{course.title}</p>
                    <p className="text-sm text-blue-600 mt-1">
                        {course.creditUnit} Unit{course.creditUnit !== 1 ? "s" : ""} • {course.department}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Level <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select your level</option>
                            <option value="100">100 Level</option>
                            <option value="200">200 Level</option>
                            <option value="300">300 Level</option>
                            <option value="400">400 Level</option>
                            <option value="500">500 Level</option>
                        </select>
                        {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Semester <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value as "First" | "Second" })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="First">First Semester</option>
                            <option value="Second">Second Semester</option>
                        </select>
                        {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Academic Session <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.session}
                            onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select academic session</option>
                            <option value="2024/2025">2024/2025</option>
                            <option value="2025/2026">2025/2026</option>
                            <option value="2026/2027">2026/2027</option>
                        </select>
                        {errors.session && <p className="text-red-500 text-sm mt-1">{errors.session}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="destructive"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Enrolling..." : "Enroll"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};