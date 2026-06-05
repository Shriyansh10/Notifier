import {z} from "zod";

export const signUpInput = z.object({
  email: z.email().describe("Email address of the user"),
  fullname: z.string().min(3).max(50).describe("Full name of the user"),
  password: z
    .string()
    .min(8)
    .max(200)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).describe("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"),
});

export type SignUpInputType = z.infer<typeof signUpInput>;

export const signInInput = z.object({
    email: z.email().describe("Email address of the user"),
    password: z.string().min(8).max(200).describe("Password for the user"),
});

export type SignInInputType = z.infer<typeof signInInput>;
