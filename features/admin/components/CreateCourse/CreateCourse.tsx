import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ImageIcon } from "lucide-react";

export default function CreateCourse() {
  return (
    <main className="container mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/manage-course" className="hover:text-blue-600">
          Manage Course
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">New Course</span>
      </div>

      <h1 className="text-2xl font-medium mb-8">New course</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Course Name */}
          <div>
            <label htmlFor="course-name" className="block mb-2 font-medium">
              Course Name
            </label>
            <input
              id="course-name"
              type="text"
              defaultValue="Introduction to Chemistry 101"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* Course Code */}
          <div>
            <label htmlFor="course-code" className="block mb-2 font-medium">
              Course code
            </label>
            <div className="relative">
              <select
                id="course-code"
                className="w-full p-3 border border-gray-300 rounded-md appearance-none"
                defaultValue="CHM 102"
              >
                <option value="CHM 102">CHM 102</option>
                <option value="CHM 103">CHM 103</option>
                <option value="CHM 104">CHM 104</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Course Description */}
          <div>
            <label
              htmlFor="course-description"
              className="block mb-2 font-medium"
            >
              Course Description
            </label>
            <textarea
              id="course-description"
              className="w-full p-3 border border-gray-300 rounded-md h-32"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="block mb-2 font-medium">Upload</label>
            <div className="border border-gray-300 rounded-md p-8 flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center mb-2">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Upload</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4 mt-8">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Back
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Course
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Assign Lecturer */}
          <div>
            <label htmlFor="assign-lecturer" className="block mb-2 font-medium">
              Assign lecturer
            </label>
            <div className="relative">
              <select
                id="assign-lecturer"
                className="w-full p-3 border border-gray-300 rounded-md appearance-none"
              >
                <option value="">Select lecturer</option>
                <option value="1">Dr. Smith</option>
                <option value="2">Prof. Johnson</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Illustration */}
          <div className="mt-8 flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-05-13%2018-10-27-Aizk2ceDgQL3P0i3Jo3tOjB7sirPOO.png"
              alt="Course illustration"
              width={400}
              height={300}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
