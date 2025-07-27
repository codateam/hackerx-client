

"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BulkQuestionsFormSchema, BulkQuestionsFormInput } from "../lib/validation";
import { Button } from "@/components/Button/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle, Loader, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/Textarea";
import Modal from "@/components/ui/Modal";
import { GenerateAIQuestionsForm, GenerateAIQuestionsFormValues } from "./GenerateAIQuestionsForm";
import { useAutoGenerateQuestions } from "../hooks/useQuestions";

interface QuestionFormProps {
  examId: string;
  courseId: string;
  onSubmit: (data: BulkQuestionsFormInput) => void;
  isCreating: boolean;
}

export const QuestionForm = ({ examId,courseId, onSubmit, isCreating }) => {
  const defaultQuestion = {
    type: "mcq" as const,
    text: "",
    mark: 5,
    options: ["", ""],
    correctAnswer: "",
  };

  const form = useForm<BulkQuestionsFormInput>({
    resolver: zodResolver(BulkQuestionsFormSchema),
    defaultValues: {
      exam: examId,
      questions: [defaultQuestion],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleAddQuestion = () => {
    append(defaultQuestion);
  };

 const generateQuestions = useAutoGenerateQuestions()
  // Modal state for AI generation
  const [showAIModal, setShowAIModal] = React.useState(false);
  const [aiForm, setAIForm] = React.useState<GenerateAIQuestionsFormValues>({
    difficulty: "medium",
    question_types: ["mcq"],
    num_questions: 10,
    mark: 2,
    additional_context: "make the question short",
  });
  // const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateAIQuestions = () => {
    setShowAIModal(true);
  };

  const handleAICancel = () => {
    setShowAIModal(false);
  };

  const handleAISubmit = async () => {
    generateQuestions.mutate({
      examId,
      courseId: courseId || "",
      difficulty: aiForm.difficulty,
      question_types: aiForm.question_types,
      num_questions: aiForm.num_questions,
      additional_context: aiForm.additional_context,
      mark: aiForm.mark,
    }, {
      onSuccess: (data) => {
    setTimeout(() => {
          form.reset({ 
      exam: examId,
      questions: data.map((q) => ({
        type: q.type,
        text: q.text,
        mark: q.mark,
        options: q.options || [],
        correctAnswer: q.correctAnswer || "",
      })),

      })
      setShowAIModal(false);
     
    }, 1200);
  
    }
    });
}

  const handleFormSubmit = async (data: BulkQuestionsFormInput) => {
    try {
      await onSubmit(data);
      form.reset({
        exam: examId,
        questions: [defaultQuestion],
      });
      toast.success("Questions saved successfully!");
    } catch (error) {
      console.log(error)
      toast.error("Failed to save questions. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* AI Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={handleAICancel}
        title="Auto-generate Questions"
      >
        <GenerateAIQuestionsForm
          values={aiForm}
          onChange={setAIForm}
          onSubmit={handleAISubmit}
          onCancel={handleAICancel}
          isSubmitting={generateQuestions.isPending}
        />
      </Modal>

      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <p className="text-gray-600 text-sm sm:text-base">
                Add questions manually or use AI to generate them automatically
              </p>
            </div>
            
            <Button 
              type="button" 
              variant="default" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg" 
              onClick={handleGenerateAIQuestions}
            >
              <Sparkles size={18} className="mr-2" />
              Auto-generate Questions
            </Button>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Questions ({fields.length})
            </h2>
            <Button 
              type="button" 
              variant="default" 
              className="hidden sm:flex items-center bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAddQuestion}
            >
              <PlusCircle size={16} className="mr-2" />
              Add Question
            </Button>
          </div>

          {/* Questions Container */}
          <div className="space-y-4 max-h-[70vh] pr-2">
            {fields.map((field, index) => {
              const questionType = form.watch(`questions.${index}.type`);

              return (
                <div key={field.id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-4 sm:p-6">
                    {/* Question Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold">
                          Question {index + 1}
                        </h3>
                      </div>
                      
                      {fields.length > 1 && (
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Question Type */}
                      <div className="lg:col-span-2">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Question Type
                        </Label>
                        <Controller
                          control={form.control}
                          name={`questions.${index}.type`}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                const currentQuestion = form.getValues(`questions.${index}`);
                                const newType = value as 'mcq' | 'theory' | 'german';

                                const newQuestionPayload: any = {
                                  ...currentQuestion,
                                  type: newType,
                                };

                                if (newType === 'mcq') {
                                  newQuestionPayload.options = ['', ''];
                                  newQuestionPayload.correctAnswer = '';
                                } else {
                                  delete newQuestionPayload.options;
                                  delete newQuestionPayload.correctAnswer;
                                }

                                form.setValue(`questions.${index}`, newQuestionPayload);
                              }}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select question type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mcq">Multiple Choice (MCQ)</SelectItem>
                                <SelectItem value="theory">Theory</SelectItem>
                                <SelectItem value="german">Short Answer</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      {/* Question Text */}
                      <div className="lg:col-span-2">
                        <Label htmlFor={`questions.${index}.text`} className="text-sm font-medium text-gray-700 mb-2 block">
                          Question Text
                        </Label>
                        <Textarea
                          {...form.register(`questions.${index}.text`)}
                          placeholder="Enter your question here..."
                        />
                        {form.formState.errors.questions?.[index]?.text && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.questions[index].text.message}
                          </p>
                        )}
                      </div>

                      {/* Mark */}
                      <div>
                        <Label htmlFor={`questions.${index}.mark`} className="text-sm font-medium text-gray-700 mb-2 block">
                          Points
                        </Label>
                        <Input 
                          type="number" 
                          min="1"
                          max="100"
                          {...form.register(`questions.${index}.mark`, { valueAsNumber: true })}
                          className="w-full"
                          placeholder="5"
                        />
                        {form.formState.errors.questions?.[index]?.mark && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.questions[index].mark.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* MCQ Options */}
                    {questionType === 'mcq' && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-semibold mb-4 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Answer Options
                        </h4>
                        
                        <div className="space-y-3">
                          {form.getValues(`questions.${index}.options`)?.map((_, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <div className="flex-shrink-0 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                                {String.fromCharCode(65 + optIndex)}
                              </div>
                              <Input 
                                {...form.register(`questions.${index}.options.${optIndex}`)} 
                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                className="flex-1"
                              />
                              {(form.getValues(`questions.${index}.options`) && form.getValues(`questions.${index}.options`)!.length > 2) && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    const options = form.getValues(`questions.${index}.options`) || [];
                                    form.setValue(`questions.${index}.options`, options.filter((_, i) => i !== optIndex));
                                  }}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                            onClick={() => {
                              const options = form.getValues(`questions.${index}.options`) || [];
                              if (options.length < 6) {
                                form.setValue(`questions.${index}.options`, [...options, '']);
                              }
                            }}
                          >
                            <PlusCircle size={16} className="mr-2" />
                            Add Option
                          </Button>

                          {/* Correct Answer */}
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              Correct Answer
                            </Label>
                            <Controller
                              control={form.control}
                              name={`questions.${index}.correctAnswer`}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select correct answer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {form.watch(`questions.${index}.options`)?.map((opt, i) => (
                                      opt && (
                                        <SelectItem key={i} value={opt}>
                                          {String.fromCharCode(65 + i)}) {opt}
                                        </SelectItem>
                                      )
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {form.formState.errors.questions?.[index]?.correctAnswer && (
                              <p className="text-red-500 text-sm mt-1">
                                {form.formState.errors.questions[index].correctAnswer.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Add Question Button */}
          <Button 
            type="button" 
            variant="default" 
            className="w-full sm:hidden bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddQuestion}
          >
            <PlusCircle size={16} className="mr-2" />
            Add Another Question
          </Button>
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600">
                {fields.length} question{fields.length !== 1 ? 's' : ''} ready to save
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button 
                type="button" 
                variant="default" 
                className="hidden sm:flex bg-green-600 hover:bg-green-700 text-white"
                onClick={handleAddQuestion}
              >
                <PlusCircle size={16} className="mr-2" />
                Add Question
              </Button>
              
              <Button 
                type="submit" 
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Saving Questions...
                  </>
                ) : (
                  "Save All Questions"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};