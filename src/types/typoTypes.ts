import { z } from 'zod'

export const FORMAT_MODES = ['symbol', 'name', 'digit'] as const

export type FormatMode = (typeof FORMAT_MODES)[number]

export const zFormatSchema = z.object({
  sourceText: z.string().trim().min(1, 'Text is required'),
  formatMode: z.enum(FORMAT_MODES),
})

export type FormatInput = z.infer<typeof zFormatSchema>
