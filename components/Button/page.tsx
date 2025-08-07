"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white",
  {
    variants: {
      variant: {
        default:
          "bg-[#0000ff] text-white hover:bg-[#0000ff]/90 border border-[#0000ff]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background !text-black hover:bg-accent hover:!text-black",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        yellow:
          "bg-[#f8c35c] text-white border border-[#f8c35c] hover:bg-white hover:text-[#f8c35c] hover:border-[#f8c35c]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto py-[10px] px-6",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "rounded-full p-[10px]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const router = useRouter();
    const Comp = asChild ? Slot : "button";

    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      if (onClick) {
        onClick(e);
      }
      if (props.href) {
        router.push(props.href as string);
      }
    };

    return (
      <Comp
        className={buttonVariants({
          variant,
          size,
          className,
        })}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
