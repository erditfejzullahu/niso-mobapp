import {z} from "zod"

export const createRideSchema = z.object({
    isUrgent: z.boolean(),
    price: z.string(),
    fromAddress: z.string().min(3, "Duhet te pakten 3 karaktere ne adresen e pikenisjes"),
    toAddress: z.string().min(3, "Duhet te pakten 3 karaktere ne adresen e mberritjes")
})