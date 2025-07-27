import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ className, label, error, ...props }: TextareaProps) {
  return (
    <div className="relative">
      {label ? (
        <div className="absolute left-4 top-2 text-[#717171] text-[14px]/[16.94px] font-medium">
          {label}
        </div>
      ) : null}
      <textarea
        className={cn(
          "min-h-[100px] w-full bg-[#F5F4F7] rounded-[5px] px-4 py-3",
          "text-black placeholder:text-black font-extrabold",
          "focus:outline-none focus:ring-2 focus:ring-[#475edf] border border-[#0000FF] focus:border-transparent focus:bg-[#F5F4F7]",
          error && "border-red-500",
          className
        )}
        {...props}
      />
    </div>
  );
}