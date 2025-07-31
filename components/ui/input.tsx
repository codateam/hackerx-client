import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  }
>(({ className, label, type, error, ...props }, ref) => {
  return (
    <div className="relative">
      {label ? (
        <div className="absolute left-4 top-2 text-[#717171] text-[14px]/[16.94px] font-medium">
          {label}
        </div>
      ) : null}
      <input
        id={props.id}
        name={props.name}
        type={type}
        className={cn(
          "h-[50px] w-full bg-[#F5F4F7] rounded-[5px] px-4 pt-4",
          "text-black placeholder:text-black font-extrabold",
          "focus:outline-none focus:ring-2 focus:ring-[#475edf] border border-[#0000FF] focus:border-transparent focus:bg-[#F5F4F7]",
          error && "border-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
