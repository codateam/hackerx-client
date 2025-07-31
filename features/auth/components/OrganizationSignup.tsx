"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import { Button } from "@/components/Button/page";
import { Input } from "@/components/ui/input";
import { OrganizationSignupSchema } from "@/features/auth/lib/validation";
import { handleOrgSignup } from "@/features/auth/api";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrganizationSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof OrganizationSignupSchema>>({
    resolver: zodResolver(OrganizationSignupSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState, reset } = form;

  const onSubmit = async (values: z.infer<typeof OrganizationSignupSchema>) => {
    setIsLoading(true);
    try {
      const payload = {
        organization: {
          name: values.name,
          code: values.code,
          type: values.type,
          description: values.description,
        },
        mainAdmin: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        },
      };

      const res = await handleOrgSignup(payload);
      if (res.success) {
        toast.success(res.message);
        setTimeout(() => {
          reset();
          router.push("/login");
        }, 3000);
      } else {
        toast.error(res.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-xl mx-auto px-4">
      <div className="container flex flex-col md:items-start items-center justify-between mx-auto lg:px-6">
        <h2 className="my-2 md:pb-16 text-2xl md:text-4xl font-semibold text-center md:text-start text-black tracking-[-0.5%]">
          Organization Registration
        </h2>

        <div className="flex flex-col justify-between md:flex-row gap-10 w-full">
          <div className="w-full md:w-1/2">
            <Image
              src="/images/org3.png"
              alt="Person working on laptop"
              width={600}
              height={600}
              className="object-cover hidden md:block"
            />
          </div>
          <div className="w-full md:w-1/2 md:max-w-[305px] md:mr-16">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold">Organization Details</h3>
              <Input
                type="text"
                label="Organization Name"
                id="name"
                {...register("name")}
                error={formState.errors.name?.message}
              />
              <Input
                type="text"
                label="Organization Code"
                id="code"
                {...register("code")}
                error={formState.errors.code?.message}
              />
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Organization Type
                </label>

                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="type"
                        className="w-full md:px-6 py-3 border border-[#0000FF] focus:ring-0 focus:outline-none rounded-md"
                      >
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>

                      <SelectContent>
                        {[
                          "university",
                          "school",
                          "college",
                          "institute",
                          "academy",
                        ].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {formState.errors.type?.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {formState.errors.type.message}
                  </p>
                )}
              </div>

              <Input
                type="text"
                label="Description"
                id="description"
                {...register("description")}
                error={formState.errors.description?.message}
              />

              <h3 className="text-lg font-semibold">Main Admin Details</h3>

              <Input
                type="text"
                label="First Name"
                id="firstName"
                {...register("firstName")}
                error={formState.errors.firstName?.message}
              />
              <Input
                type="text"
                label="Last Name"
                id="lastName"
                {...register("lastName")}
                error={formState.errors.lastName?.message}
              />
              <Input
                label="Email"
                id="email"
                type="email"
                {...register("email")}
                error={formState.errors.email?.message}
              />

              <div className="relative">
                <Input
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={formState.errors.password?.message}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <Button type="submit" className="w-full py-2 text-lg">
                Create Organization
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
    </div>
  );
};

export default OrganizationSignup;
