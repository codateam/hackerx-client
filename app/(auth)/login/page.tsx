"use client";

import { useState } from "react";
import { Button } from "@/components/Button/page";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginValidationSchema } from "@/features/auth/lib/validation";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { handleLogin } from "@/features/auth/api";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { hasRole } = useAuth();

  const form = useForm<z.infer<typeof LoginValidationSchema>>({
    resolver: zodResolver(LoginValidationSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { formState } = form;
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (
    values: z.infer<typeof LoginValidationSchema>
  ) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await handleLogin(values);

      if (res.success) {
        toast.success(res.message || "Login successful", {
          className: "font-poppins font-normal",
        });

        setTimeout(() => {
          form.reset();
          if (hasRole("admin")) {
            router.push("/admin");
          } else if (hasRole("lecturer")) {
            router.push("/lecturer");
          } else {
            router.push("/student");
          }
        }, 2000);
      } else {
        toast.error(res.message || "Login failed", {
          className: "font-poppins font-normal",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        className: "font-poppins font-normal",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col md:items-start items-center justify-center mx-auto px-4 md:px-6">
      <div className="flex justify-center items-center md:justify-between pt-4 md:gap-10 w-full">
        <div className="hidden md:block w-full md:w-[1/2]">
          <div className="hidden md:block">
            <Image
              src="/images/student-hero.png"
              alt="login"
              width={600}
              height={600}
            />
          </div>
        </div>
        <div className="w-full md:w-[1/2] md:max-w-[305px] md:mr-16 flex items-center justify-center flex-col place-content-center">
          <h2 className="my-2 text-2xl md:text-4xl font-semibold text-center text-black tracking-[-0.5%] pb-10">
            Login
          </h2>
          <form
            className="space-y-8 w-full px-4 md:px-0"
            onSubmit={form.handleSubmit(submitHandler)}
          >
            <Input
              label="Email address"
              id="email"
              type="email"
              autoComplete="email"
              {...form.register("email")}
              error={formState.errors.email?.message}
              className="pt-4"
            />
            <div className="relative">
              <Input
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...form.register("password")}
                error={formState.errors.password?.message}
                className="pt-4"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full py-[10px] flex justify-center border border-transparent rounded-full shadow-sm text-[24px]/[29.05px] font-medium text-white bg-[#475edf] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#475edf]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </div>
          </form>

          <p className="place-self-end font-medium text-black text-[13px]/[15.73px] tracking-[-0.5%] pt-5 md:pt-8 pr-4 md:pr-0">
            <Link
              href="/forgot-password"
              className="text-black hover:text-[#475edf]"
            >
              Forgot Password?
            </Link>
          </p>

          <p className="mt-4 md:mt-6 text-center font-medium text-black text-[14px]/[16.94px] tracking-[-0.5%]">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up/signup-choice"
              className="font-medium text-[#0000ff] hover:text-[#475edf]"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
