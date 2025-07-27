"use client";

import { useState } from "react";
import { Button } from "@/components/Button/page";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupValidationSchema } from "@/features/auth/lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { handleSignup } from "@/features/auth/api";

export default function Signup() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      matricNo: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { formState } = form;

  const submitHandler = async (
    values: z.infer<typeof SignupValidationSchema>
  ) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const isFormValid = Object.keys(formState.errors).length === 0;
      if (!isFormValid) {
        setIsLoading(false);
        toast.error("Please fill all the fields correctly.", {
          className: "font-poppins font-normal",
        });
        return;
      }

      const res = await handleSignup(values);

      if (res.success) {
        setIsLoading(false);
        toast.success(res.message);

        setTimeout(() => {
          form.reset();
          router.push("/student");
        }, 3000);
      } else {
        setIsLoading(false);
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      toast.error("An unexpected error occurred. Please try again.", {
        className: "font-poppins font-normal",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin text-primary h-12 w-12" />
      </div>
    );
  }

  return (
    <>
      <div className="container flex flex-col md:items-start items-center justify-between mx-auto px-6">
        <h2 className="my-2 pb-2 md:pb-16 text-2xl md:text-4xl font-semibold text-center md:text-start text-black tracking-[-0.5%]">
          Student Registration
        </h2>

        <div className="flex flex-col justify-between md:flex-row gap-10 w-full">
          <div className="w-full md:w-1/2">
            <Image
              src="/images/hero-img.png"
              alt="Person working on laptop"
              width={500}
              height={500}
              className="object-cover hidden md:block"
            />
          </div>
          <div className="w-full md:w-1/2 md:max-w-[305px] md:mr-16">
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(submitHandler)}
            >
              <Input
                label="First Name"
                id="firstName"
                type="text"
                autoComplete="given-name"
                {...form.register("firstName")}
                error={formState.errors.firstName?.message}
                className="pt-4"
              />

              <Input
                label="Last Name"
                id="lastName"
                type="text"
                autoComplete="family-name"
                {...form.register("lastName")}
                error={formState.errors.lastName?.message}
                className="pt-4"
              />

              <Input
                label="Matric Number"
                id="matricNumber"
                type="text"
                autoComplete="off"
                {...form.register("matricNo")}
                error={formState.errors.matricNo?.message}
                className="pt-4"
              />

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

              <div className="relative">
                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...form.register("confirmPassword")}
                  error={formState.errors.confirmPassword?.message}
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

              <Button
                type="submit"
                className="w-full py-[10px] flex justify-center border border-transparent rounded-full shadow-sm text-[24px]/[29.05px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#475edf]"
              >
                Sign Up
              </Button>
            </form>

            <p className="mt-4 md:mt-6 text-center font-medium text-black text-[14px]/[16.94px] tracking-[-0.5%]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#0000ff] hover:text-[#475edf]"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 text-center items-center justify-center py-6">
        <span className="text-center text-base tracking-[0.5%] font-medium">
          By clicking on Sign Up Button, you agree with{" "}
          <a href="#" className="text-primary">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary">
            Privacy Policy
          </a>
        </span>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
