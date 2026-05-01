import { z } from "zod";
import { KosovoCity } from "@/types/app-types";

const kosovoCities = Object.values(KosovoCity) as string[];

export const verifyIdentitySchema = z.object({
  address: z
    .string()
    .trim()
    .min(5, "Ju lutem shkruani një adresë të vlefshme (të paktën 5 karaktere)."),
  city: z
    .string()
    .trim()
    .min(1, "Ju lutem zgjidhni qytetin.")
    .refine((v) => kosovoCities.includes(v), "Ju lutem zgjidhni një qytet nga lista."),
  gender: z.enum(["MALE", "FEMALE", "RATHER_NOT_SAY"], {
    message: "Ju lutem zgjidhni gjininë.",
  }),
  selfie: z.string().min(1, "Ju lutem ngarkoni një selfie."),
  idFront: z.string().min(1, "Ju lutem ngarkoni anën e përparme të letërnjoftimit."),
  idBack: z.string().min(1, "Ju lutem ngarkoni anën e pasme të letërnjoftimit."),
});

export type VerifyIdentityFormValues = z.infer<typeof verifyIdentitySchema>;
