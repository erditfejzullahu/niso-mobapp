import {z} from 'zod'

export const registerSchema = z.object({
    fullName: z.string().min(3, "Emri duhet te jete me te pakten 3 karaktere."),
    email: z.email("Ju lutem paraqisni emailin ne tip te emailit."),
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