"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  predictSchema,
  PredictFormData,
  PredictionResult,
} from "@/src/schemas/predictValidator"
import { predictSingle } from "@/src/services/predict.service"

export default function PredictPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [showModal, setShowModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PredictFormData>({
    resolver: zodResolver(predictSchema),
    mode: "onBlur",
  })

  const onSubmit = async (data: PredictFormData) => {
    setLoading(true)
    setResult(null)

    try {
      const res = await predictSingle(data)
      setResult(res.data)
      setShowModal(true)
    } catch (error) {
      alert("Prediction failed")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const FormField = ({
    label,
    error,
    children,
  }: {
    label: string
    error?: string
    children: React.ReactNode
  }) => (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium mb-1">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )

  const Section = ({ title }: { title: string }) => (
    <h2 className="col-span-3 mt-8 mb-3 text-lg font-semibold text-pink-600">
      {title}
    </h2>
  )

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold text-pink-600 mb-6">
        Newborn Risk Prediction
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* ---------------- Basic Info ---------------- */}
        <Section title="Basic Info" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <FormField label="Name" error={errors.name?.message}>
            <input
              {...register("name")}
              className={`input ${errors.name ? "border-red-500" : ""}`}
            />
          </FormField>

          <FormField label="Gender" error={errors.gender?.message}>
            <select
              {...register("gender", { valueAsNumber: true })}
              className={`input ${errors.gender ? "border-red-500" : ""}`}
            >
              <option value="">Select Gender</option>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
            </select>
          </FormField>

        </div>

        {/* ---------------- Birth Details ---------------- */}
        <Section title="Birth Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <FormField label="Gestational Age (weeks)" error={errors.gestational_age_weeks?.message}>
            <input type="number" {...register("gestational_age_weeks", { valueAsNumber: true })} className={`input ${errors.gestational_age_weeks ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Birth Weight (kg)" error={errors.birth_weight_kg?.message}>
            <input type="number" step="0.01" {...register("birth_weight_kg", { valueAsNumber: true })} className={`input ${errors.birth_weight_kg ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Birth Length (cm)" error={errors.birth_length_cm?.message}>
            <input type="number" step="0.01" {...register("birth_length_cm", { valueAsNumber: true })} className={`input ${errors.birth_length_cm ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Birth Head Circumference (cm)" error={errors.birth_head_circumference_cm?.message}>
            <input type="number" step="0.01" {...register("birth_head_circumference_cm", { valueAsNumber: true })} className={`input ${errors.birth_head_circumference_cm ? "border-red-500" : ""}`} />
          </FormField>

        </div>

        {/* ---------------- Current Measurements ---------------- */}
        <Section title="Current Measurements" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <FormField label="Age (days)" error={errors.age_days?.message}>
            <input type="number" {...register("age_days", { valueAsNumber: true })} className={`input ${errors.age_days ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Weight (kg)" error={errors.weight_kg?.message}>
            <input type="number" step="0.01" {...register("weight_kg", { valueAsNumber: true })} className={`input ${errors.weight_kg ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Length (cm)" error={errors.length_cm?.message}>
            <input type="number" step="0.01" {...register("length_cm", { valueAsNumber: true })} className={`input ${errors.length_cm ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Head Circumference (cm)" error={errors.head_circumference_cm?.message}>
            <input type="number" step="0.01" {...register("head_circumference_cm", { valueAsNumber: true })} className={`input ${errors.head_circumference_cm ? "border-red-500" : ""}`} />
          </FormField>

        </div>

        {/* ---------------- Vitals ---------------- */}
        <Section title="Vitals" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <FormField label="Temperature (°C)" error={errors.temperature_c?.message}>
            <input type="number" step="0.01" {...register("temperature_c", { valueAsNumber: true })} className={`input ${errors.temperature_c ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Heart Rate (bpm)" error={errors.heart_rate_bpm?.message}>
            <input type="number" {...register("heart_rate_bpm", { valueAsNumber: true })} className={`input ${errors.heart_rate_bpm ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Respiratory Rate (bpm)" error={errors.respiratory_rate_bpm?.message}>
            <input type="number" {...register("respiratory_rate_bpm", { valueAsNumber: true })} className={`input ${errors.respiratory_rate_bpm ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Oxygen Saturation (%)" error={errors.oxygen_saturation?.message}>
            <input type="number" {...register("oxygen_saturation", { valueAsNumber: true })} className={`input ${errors.oxygen_saturation ? "border-red-500" : ""}`} />
          </FormField>

        </div>

        {/* ---------------- Feeding & Health ---------------- */}
        <Section title="Feeding & Health" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <FormField label="Feeding Type" error={errors.feeding_type?.message}>
            <select {...register("feeding_type", { valueAsNumber: true })} className={`input ${errors.feeding_type ? "border-red-500" : ""}`}>
              <option value="">Select Feeding Type</option>
              <option value={0}>Breastfeeding</option>
              <option value={1}>Formula</option>
            </select>
          </FormField>

          <FormField label="Feeding Frequency / Day" error={errors.feeding_frequency_per_day?.message}>
            <input type="number" {...register("feeding_frequency_per_day", { valueAsNumber: true })} className={`input ${errors.feeding_frequency_per_day ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Urine Output Count" error={errors.urine_output_count?.message}>
            <input type="number" {...register("urine_output_count", { valueAsNumber: true })} className={`input ${errors.urine_output_count ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Stool Count" error={errors.stool_count?.message}>
            <input type="number" {...register("stool_count", { valueAsNumber: true })} className={`input ${errors.stool_count ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Jaundice Level (mg/dl)" error={errors.jaundice_level_mg_dl?.message}>
            <input type="number" step="0.01" {...register("jaundice_level_mg_dl", { valueAsNumber: true })} className={`input ${errors.jaundice_level_mg_dl ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="APGAR Score" error={errors.apgar_score?.message}>
            <input type="number" {...register("apgar_score", { valueAsNumber: true })} className={`input ${errors.apgar_score ? "border-red-500" : ""}`} />
          </FormField>

          <FormField label="Immunizations Done" error={errors.immunizations_done?.message}>
            <select {...register("immunizations_done", { valueAsNumber: true })} className={`input ${errors.immunizations_done ? "border-red-500" : ""}`}>
              <option value="">Select Option</option>
              <option value={1}>Done</option>
              <option value={0}>Not Done</option>
            </select>
          </FormField>

          <FormField label="Reflexes Normal" error={errors.reflexes_normal?.message}>
            <select {...register("reflexes_normal", { valueAsNumber: true })} className={`input ${errors.reflexes_normal ? "border-red-500" : ""}`}>
              <option value="">Select Option</option>
              <option value={1}>Normal</option>
              <option value={0}>Abnormal</option>
            </select>
          </FormField>

        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white font-semibold shadow-md disabled:opacity-60"
          >
            {loading ? "Predicting..." : "Submit Prediction"}
          </button>
        </div>

      </form>

        {showModal && result && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative animate-fadeIn">

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg duration-300"
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold mb-6 text-center">
                Prediction Result
              </h2>

              {result.results.map((r, i) => (
                <div
                  key={i}
                  className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <p><span className="font-semibold">Condition:</span> {r.condition}</p>
                  <p><span className="font-semibold">Risk Level:</span> {r.risk_level}</p>
                  <p><span className="font-semibold">Likelyhood:</span> {r.confidence}%</p>
                </div>
              ))}

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
