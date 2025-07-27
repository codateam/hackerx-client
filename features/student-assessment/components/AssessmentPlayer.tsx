"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useExamQuestions, useStudentProgress, useSaveProgress, useSubmitAnswers } from "../hooks/useStudentAssessment"
import { QuestionRenderer } from "./QuestionRenderer"
import { Timer } from "./Timer"
import { Button } from "@/components/Button/page"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { resetAssessment, setAnswer } from "@/store/assessmentSlice"
import type { RootState } from "@/store/store"
import type { Exam } from "@/types/exam"
import { AssessmentSuccess } from "./AssessmentSuccess"

interface AssessmentPlayerProps {
  exam: Exam
}

export const AssessmentPlayer: React.FC<AssessmentPlayerProps> = ({ exam }) => {
  const dispatch = useDispatch()
  const { answers, remainingTime } = useSelector((state: RootState) => state.assessment)

  const { data: questions, isLoading: isLoadingQuestions } = useExamQuestions(exam._id)
  const { data: progress, isLoading: isLoadingProgress } = useStudentProgress(exam._id)
  const { mutate: saveProgress, isPending: isSaving } = useSaveProgress()
  const { mutate: submitAnswers, isPending: isSubmitting } = useSubmitAnswers()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionResults, setSubmissionResults] = useState<any>(null)
  const [results, setResults] = useState<any>(null)

  const durationInSeconds = exam.duration ? exam.duration * 60 : 3600
  const currentQuestion = questions?.[currentIndex]

  useEffect(() => {
    if (progress?.answers) {
      progress.answers.forEach((ans) => {
        dispatch(
          setAnswer({
            question: ans.question?._id,
            selectedAnswer: ans.selectedAnswer,
            writtenAnswer: ans.writtenAnswer,
            examId: exam._id,
            questionText: ans.question?.text,
          })
        )
      })
    }
  }, [progress, dispatch])

  const handleSaveProgress = useCallback(() => {
    const payload = {
      examId: exam._id,
      answers: Object.values(answers),
      remainingTime: remainingTime || durationInSeconds,
    }
    saveProgress(payload)
  }, [exam._id, answers, remainingTime, durationInSeconds, saveProgress])

  const handleSubmit = useCallback(() => {
    if (isSubmitting || isSubmitted) return
    
    const payload = {
      examId: exam._id,
      answers: Object.values(answers).map((ans) => ({
        ...ans,
        examId: exam._id,
        question: ans.question,
        selectedAnswer: ans.selectedAnswer,
        writtenAnswer: ans.writtenAnswer,
        questionText: ans.questionText,
        type: ans.type || "mcq", // Default to 'mcq' if type is not set
        score: ans.score || 0,
      })),
      // answers: Object.values(answers).map(ans => ({
      //   question: ans.question,
      //   userAnswer: ans.selectedAnswer ?? ans.writtenAnswer,

      // })),
      remainingTime: remainingTime || 0,
    }

    submitAnswers(payload, {
      onSuccess: (data) => {
        setResults({totalMarks: data.totalMarks,totalOriginalMarks:data.totalOriginalMarks, answers: data.answers})
        setIsSubmitted(true)
        setSubmissionResults(data)
      }
    })
  }, [exam._id, answers, remainingTime, submitAnswers, isSubmitting, isSubmitted])

  const handleTimeUp = useCallback(() => {
    setTimeout(() => {
      handleSubmit()
    }, 0)
  }, [handleSubmit])

  // useEffect(() => {
  //   if (submissionResults && !isSubmitted) {
  //     try {
  //       const questionsArray = submissionResults.questions || []
        
  //       if (!Array.isArray(questionsArray)) {
  //         setIsSubmitted(true)
  //         return
  //       }

  //       const mcq = questionsArray.filter((q) => q.type === "mcq")
  //       const german = questionsArray.filter((q) => q.type === "german")

  //       const mcqResults = mcq.reduce(
  //         (acc, q) => {
  //           acc.correct += q.correct ? 1 : 0;
  //           acc.total += 1;
  //           acc.detailedResults.push({
  //             userAnswer: q.userAnswer,
  //             correctAnswer: q.correctAnswer,
  //             isCorrect: q.correct,
  //           });
  //           return acc;
  //         },
  //         { correct: 0, total: 0, detailedResults: [] as any[] }
  //       );
        
  //       if (mcqResults.total > 0) {
  //         mcqResults.percentage = Math.round((mcqResults.correct / mcqResults.total) * 100);
  //       }

  //       const germanResults = {
  //         score: 0,
  //         feedback: "",
  //         detailedResults: [] as any[],
  //       };

  //       german.forEach((q) => {
  //         germanResults.score += q.score || 0;
  //         germanResults.feedback += (q.feedback || "No feedback provided") + " ";
  //         germanResults.detailedResults.push({
  //           userAnswer: q.userAnswer,
  //           correctAnswer: q.correctAnswer,
  //           isCorrect: q.correct,
  //         });
  //       });

  //       const totalQuestions = questionsArray.length;
  //       const correctAnswers = questionsArray.filter((q) => q.correct).length;
  //       const totalScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  //       const processedResults = {
  //         totalScore,
  //         correctAnswers,
  //         totalQuestions,
  //         mcqResults: mcqResults.total > 0 ? mcqResults : null,
  //         germanResults: german.length > 0 ? germanResults : null,
  //       };

  //       setResults(processedResults);
  //       setIsSubmitted(true);
  //     } catch (error) {
  //       console.error('Error processing results:', error)
  //       setIsSubmitted(true);
  //     }
  //   }
  // }, [submissionResults, isSubmitted]);

  useEffect(() => {
    if (isSubmitted) {
      dispatch(resetAssessment())
    }
  }, [isSubmitted, dispatch])

  if (isLoadingQuestions || isLoadingProgress) return <LoadingSpinner />

  if (!questions || questions.length === 0) {
    return (
      <p>
        No questions available for this exam.{" "}
        <span className="italic text-secondary">Check back later!</span>
      </p>
    )
  }

  if (isSubmitted) {
    return <AssessmentSuccess exam={exam} results={results} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
          {exam.duration && (
            <div className="text-xl font-mono font-semibold text-gray-900">
              <Timer
                initialDuration={progress?.remainingTime ?? durationInSeconds}
                onTimeUp={handleTimeUp}
              />
            </div>
          )}
        </div>

        <div className="mb-8 p-8">
          <div className="mb-6">
            {currentQuestion && (
              <QuestionRenderer question={currentQuestion} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Button
            variant="default"
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
            className="bg-blue-600 hover:bg-blue-700 px-6"
          >
            Previous
          </Button>

          <span className="text-gray-600 font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={currentIndex === questions.length - 1}
              className="px-6"
            >
              Next
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleSaveProgress}
            disabled={isSaving}
            className="px-6"
          >
            {isSaving ? "Saving..." : "Save Progress"}
          </Button>
        </div>
      </div>
    </div>
  )
}