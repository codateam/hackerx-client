"use client"

import { CheckCircle, ArrowLeft, Trophy } from "lucide-react"
import { Button } from "@/components/Button/page"
import { useRouter } from "next/navigation"

interface AssessmentSuccessProps {
  exam: any;
  results: {totalMarks:number, totalOriginalMarks: number};
}
export const AssessmentSuccess: React.FC<AssessmentSuccessProps> = ({ exam, results }) => {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-2xl relative z-10">
          <div className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-2xl">
            <div className="p-8 sm:p-12 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 md:w-10 md:h-80 bg-gradient-to-r from-green-800 to-green-950 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <Trophy className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">🎉 Assessment Completed!</h1>
                <div className="space-y-2">
                  <p className="text-lg sm:text-xl text-gray-700 font-medium">
                    Congratulations! Your submission was successful.
                  </p>
          
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                    You can review your results below. If you have any questions, please contact your instructor.
                  </p>
                </div>

                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <div className="text-sm text-gray-600 mb-1">Overall Score</div>
                    {results.totalOriginalMarks && results.totalOriginalMarks > 0 
              ? Math.round((results.totalMarks / results.totalOriginalMarks) * 100)
              : 0}%
                            {/* <div className="text-sm text-gray-500">{results.correctAnswers} out of {results.totalQuestions} correct</div> */}
                  </div>
              </div>

            

              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => {
                    if (exam?.course) {
                    router.back();
                    } else {
                      window.location.href = '/student/dashboard';
                    }
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Course
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Print Results
                </Button>
              </div>

              <div className="border-t border-gray-200">
                <p className="text-sm text-gray-500 pt-6">
                  Need help? Contact your instructor or visit our{" "}
                  <a href="/support" className="text-green-600 hover:text-green-700 underline">
                    support center
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}