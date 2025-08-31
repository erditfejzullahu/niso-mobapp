import {z} from "zod"

export const passwordResetSchema = z.object({
    password: z.string()
        .min(8, "Fjalekalimi duhet te kete te pakten 8 karaktere.")
        .regex(/[a-z]/, "Fjalekalimi duhet te permbaje te pakten nje shkronje te vogel.")
        .regex(/[A-Z]/, "Fjalekalimi duhet te permbaje te pakten nje shkronje te madhe.")
        .regex(/[0-9]/, "Fjalekalimi duhet te permbaje te pakten nje numer.")
        .regex(/[^a-zA-Z0-9]/, "Fjalekalimi duhet te permbaje te pakten nje simbol."),
    confirmPassword: z.string()
        .min(8, "Fjalekalimi duhet te kete te pakten 8 karaktere.")
        .regex(/[a-z]/, "Fjalekalimi duhet te permbaje te pakten nje shkronje te vogel.")
        .regex(/[A-Z]/, "Fjalekalimi duhet te permbaje te pakten nje shkronje te madhe.")
        .regex(/[0-9]/, "Fjalekalimi duhet te permbaje te pakten nje numer.")
        .regex(/[^a-zA-Z0-9]/, "Fjalekalimi duhet te permbaje te pakten nje simbol."),
})