import { z } from "zod"

export const contactSupportSchema = z.object({
    message: z.string().min(10, "Duhet të paktën 10 karakterë të mesazhit."),
    subject: z.string().min(6, "Duhet të paktën 6 karakterë të mesazhit."),
    attachments: z.array(z.any().refine(file => file instanceof File, {
        error: "Duhet të jetë një skedar i vlefshëm (foto ose video)."
    })
    .optional()
    .nullable())
})