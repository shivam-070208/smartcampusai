import z from "zod/v3";



export const responseSchema = z.object({
    status: z.enum(["critical", "invalid", "none"]).optional(),
    summary: z.string().min(1),
});

