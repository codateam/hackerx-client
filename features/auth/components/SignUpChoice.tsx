"use client"
import { setAccountType } from "@/store/auth/auth.slice";
import { Button } from "@/components/Button/page";
import { GraduationCap, Building2 } from "lucide-react"
import { useDispatch } from "react-redux";

export default function SignUpChoice() {
    const dispatch = useDispatch();

const handleSelect = (type: "student" | "organization") => {
  dispatch(setAccountType(type));
};
  return (
    <div className="flex flex-col gap-20">
      {/* Sign Up Choice Section */}
      <main className="container mx-auto px-4 justify-center items-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-semibold text-[#0000ff]">Choose Your Account Type</h1>
              <p className="text-lg md:text-2xl font-medium text-[#f8c35c]">
                Select the option that best describes you
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* Student Sign Up Card */}
              <div className="bg-white border-2 border-[#0000ff] rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow">
                <div className="space-y-6">
                  <div className="flex justify-center p-6">
                    <div className="p-4 bg-[#0000ff] rounded-full flex items-center justify-center">
                      <GraduationCap className="text-white" size={40} />
                    </div>
                  </div>
                  <div className="space-y-3 p-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#0000ff]">Student</h2>
                    <p className="text-gray-600 text-lg">
                      Join as a student to take quizzes, track your progress, and enhance your learning experience.
                    </p>
                  </div>
                  <div className="p-6">
                    <Button
                    onClick={() => handleSelect("student")}
                      className="hover:text-[#0000ff] text-white w-full hover:bg-white border border-[#0000ff] rounded-lg text-xl font-medium py-6"
                    >
                      <a href="/sign-up">Sign Up as Student</a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Organization Sign Up Card */}
              <div className="bg-white border-2 border-[#f8c35c] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="space-y-6">
                  <div className="flex justify-center p-6">
                    <div className="p-4 bg-[#f8c35c] rounded-full flex items-center justify-center">
                      <Building2 className="text-white" size={40} />
                    </div>
                  </div>
                  <div className="space-y-3 p-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#f8c35c]">Organization</h2>
                    <p className="text-gray-600 text-lg">
                      Create and manage quizzes for your students, employees, or community members.
                    </p>
                  </div>
                  <div className="p-6">
                    <Button
                    variant="yellow"
                    onClick={() => handleSelect("organization")}
                      className="bg-[#f8c35c] text-white w-full hover:bg-[#f8c35c]/90 rounded-lg text-xl font-medium py-6 "
                    >
                      <a href="/sign-up/organization">Sign Up as Organization</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-[#0000ff] hover:underline font-medium">
                  Log in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
