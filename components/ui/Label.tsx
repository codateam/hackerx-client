import * as React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor?: string;
    className?: string;
    children?: React.ReactNode;
}

export function Label({ htmlFor, className, children, ...props }: LabelProps) {
    return (
        <label
            htmlFor={htmlFor}
            className={cn(
                "text-[#717171] text-[14px]/[16.94px] font-medium",
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
}