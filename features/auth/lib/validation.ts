import { z } from "zod";

export const LoginValidationSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
});

export const SignupValidationSchema = z
  .object({
    firstName: z.string().min(3, { message: "Please enter your first name" }),
    lastName: z.string().min(3, { message: "Please enter your last name" }),
    matricNo: z
      .string()
      .min(7, { message: "Please enter a valid matric number" }),
    email: z.string().email({ message: "Please enter valid email" }),
    password: z
      .string()
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/.test(
            value
          ),
        {
          message:
            "Your password must be at least 8 characters long and include an uppercase letter, a number, and a special character.",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords doesn't match.",
  });

export const AddAdminValidationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "lecturer"]),
});
