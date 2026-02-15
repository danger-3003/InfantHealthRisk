import { z } from "zod"

export const predictSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required"),

  gender: z
    .number()
    .int()
    .min(0, "Gender must be 0 or 1")
    .max(1, "Gender must be 0 or 1"),

  gestational_age_weeks: z
    .number()
    .int()
    .min(22, "Minimum 22 weeks")
    .max(42, "Maximum 42 weeks"),

  birth_weight_kg: z
    .number()
    .gt(0.5, "Must be > 0.5 kg")
    .max(6.0, "Maximum 6 kg"),

  birth_length_cm: z
    .number()
    .gt(30, "Must be > 30 cm")
    .max(60, "Maximum 60 cm"),

  birth_head_circumference_cm: z
    .number()
    .gt(20, "Must be > 20 cm")
    .max(40, "Maximum 40 cm"),

  age_days: z
    .number()
    .int()
    .min(0)
    .max(28, "Maximum 28 days"),

  weight_kg: z
    .number()
    .gt(0.5)
    .max(6.0),

  length_cm: z
    .number()
    .gt(30)
    .max(60),

  head_circumference_cm: z
    .number()
    .gt(20)
    .max(40),

  temperature_c: z
    .number()
    .min(35.0, "Minimum 35°C")
    .max(42.0, "Maximum 42°C"),

  heart_rate_bpm: z
    .number()
    .int()
    .min(60)
    .max(220),

  respiratory_rate_bpm: z
    .number()
    .int()
    .min(20)
    .max(90),

  oxygen_saturation: z
    .number()
    .min(70, "Minimum 70%")
    .max(100, "Maximum 100%"),

  feeding_type: z
    .number()
    .int()
    .min(0)
    .max(1),

  feeding_frequency_per_day: z
    .number()
    .int()
    .min(1)
    .max(12),

  urine_output_count: z
    .number()
    .int()
    .min(0)
    .max(10),

  stool_count: z
    .number()
    .int()
    .min(0)
    .max(10),

  jaundice_level_mg_dl: z
    .number()
    .min(0.1)
    .max(30),

  apgar_score: z
    .number()
    .int()
    .min(0)
    .max(10),

  immunizations_done: z
    .number()
    .int()
    .min(0)
    .max(1),

  reflexes_normal: z
    .number()
    .int()
    .min(0)
    .max(1),
})

export type PredictFormData = z.infer<typeof predictSchema>

export interface PredictionResult {
  name: string
  results: {
    condition: string
    risk_level: string
    confidence: number
  }[]
}
