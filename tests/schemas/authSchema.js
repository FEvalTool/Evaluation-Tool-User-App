import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Username cannot be empty"),
    password: z.string().min(1, "Password cannot be empty"),
});

export const genTokenQASchema = z.object({
    username: z.string().min(1, "Username cannot be empty"),
    questions: z
        .array(z.number().int())
        .refine((items) => new Set(items).size === items.length, {
            message: "All items must be unique",
        })
        .length(3, "Must provide exactly 3 questions"),
    answers: z
        .array(z.string().nonempty())
        .length(3, "Must provide exactly 3 answers"),
});
