import { z } from "zod";

export const setPasswordSchema = z.object({
    password: z.string().min(1, "Password cannot be empty"),
});

export const setSecurityQASchema = z.object({
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
