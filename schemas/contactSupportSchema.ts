import { z } from "zod"

export const contactSupportSchema = z.object({
    message: z.string().min(10, "Duhet të paktën 10 karakterë të mesazhit."),
    imageOrVideo: z.any().refine(file => file instanceof File, {
        error: "Duhet të jetë një skedar i vlefshëm (foto ose video)."
    })
    .optional()
    .nullable()
})