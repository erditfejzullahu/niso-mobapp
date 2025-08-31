import { Gender, KosovoCity } from "@/types/app-types"
import {z} from "zod"

export const userDetailsSchema = z.object({
    fullName: z.string().min(3, "Nevojiten te pakten 3 karaktere per emrin tuaj."),
    email: z.email("Duhet te jete email ne tipin e emailit."),
    image: z.string("Duhet te kete nje foto per ngarkim."),
    address: z.string().min(4, "Nevojiten te pakten 4 karaktere te adreses valide."),
    city: z.enum(KosovoCity),
    gender: z.enum(Gender),
})