import {z} from "zod";

export const signUpInput = z.object({
    email: z.email(),
    fullname: z.string().min(3).max(50),
    password: z.string().min(8).max(200),
});

export type SignUpInputType = z.infer<typeof signUpInput>;

export const signInInput = z.object({
    email: z.email(),
    password: z.string().min(8).max(200),
});

export type SignInInputType = z.infer<typeof signInInput>;



