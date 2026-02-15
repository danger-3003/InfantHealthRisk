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

  const Section = ({ title }: { title: string }) => (
    <h2 className="col-span-2 mt-6 mb-2 text-lg font-semibold text-pink-600">
      {title}
    </h2>
  )

  const ErrorMsg = ({ name }: { name: keyof PredictFormData }) =>
    errors[name] ? (
      <p className="text-xs text-red-500">
        {errors[name]?.message as string}
      </p>
    ) : null

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-6">
          Newborn Risk Prediction
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className=""
        >
          <Section title="Basic Info" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            <div className="w-full">
              <input
                placeholder="Name"
                {...register("name")}
                className="input w-full"
              />
              <ErrorMsg name="name" />
            </div>

            <select {...register("gender", { valueAsNumber: true })} className="input">
              <option value={1}>Male</option>
              <option value={2}>Female</option>
            </select>
          </div>

          <Section title="Birth Details" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            <input type="number" placeholder="Gestational Age (weeks)" {...register("gestational_age_weeks", { valueAsNumber: true })} className="input" />
            <input type="number" step="0.01" placeholder="Birth Weight (kg)" {...register("birth_weight_kg", { valueAsNumber: true })} className="input" />
            <input type="number" step="0.01" placeholder="Birth Length (cm)" {...register("birth_length_cm", { valueAsNumber: true })} className="input" />
            <input type="number" step="0.01" placeholder="Birth Head Circumference (cm)" {...register("birth_head_circumference_cm", { valueAsNumber: true })} className="input" />
          </div>

          <Section title="Current Measurements" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            <input type="number" placeholder="Age (days)" {...register("age_days", { valueAsNumber: true })} className="input" />
            <input type="number" step="0.01" placeholder="Weight (kg)" {...register("weight_kg", { valueAsNumber: true })} className="input" />
            <input type="number" step="0.01" placeholder="Length (cm)" {...register("length_cm", { valueAsNumber: true })} className="input" />
            <input type="number" step="0.01" placeholder="Head Circumference (cm)" {...register("head_circumference_cm", { valueAsNumber: true })} className="input" />
          </div>

          <Section title="Vitals" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            <input type="number" step="0.01" placeholder="Temperature (°C)" {...register("temperature_c", { valueAsNumber: true })} className="input" />
            <input type="number" placeholder="Heart Rate (bpm)" {...register("heart_rate_bpm", { valueAsNumber: true })} className="input" />
            <input type="number" placeholder="Respiratory Rate (bpm)" {...register("respiratory_rate_bpm", { valueAsNumber: true })} className="input" />
            <input type="number" step="0.01" placeholder="Oxygen Saturation (%)" {...register("oxygen_saturation", { valueAsNumber: true })} className="input" />
          </div>

          <Section title="Feeding & Health" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            <select {...register("feeding_type", { valueAsNumber: true })} className="input">
              <option value={1}>Breastfeeding</option>
              <option value={2}>Formula</option>
            </select>

            <input type="number" placeholder="Feeding Frequency / Day" {...register("feeding_frequency_per_day", { valueAsNumber: true })} className="input" />
            <input type="number" placeholder="Urine Output Count" {...register("urine_output_count", { valueAsNumber: true })} className="input" />
            <input type="number" placeholder="Stool Count" {...register("stool_count", { valueAsNumber: true })} className="input" />
            <input type="number" step="0.01" placeholder="Jaundice Level (mg/dl)" {...register("jaundice_level_mg_dl", { valueAsNumber: true })} className="input" />

            <input type="number" step="0.01" placeholder="APGAR Score" {...register("apgar_score", { valueAsNumber: true })} className="input" />

            <select {...register("immunizations_done", { valueAsNumber: true })} className="input">
              <option value={1}>Immunizations Done</option>
              <option value={0}>Not Done</option>
            </select>

            <select {...register("reflexes_normal", { valueAsNumber: true })} className="input">
              <option value={1}>Reflexes Normal</option>
              <option value={0}>Abnormal</option>
            </select>
          </div>

          <div className="w-full flex items-center justify-center mt-5">
            <button
              type="submit"
              className="w-full max-w-60 mt-2 py-3 h-10 text-sm rounded-xl bg-linear-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 transition-all duration-300 text-white font-semibold shadow-md shadow-pink-200/50 disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
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
                  <p><strong>Condition:</strong> {r.condition}</p>
                  <p><strong>Risk Level:</strong> {r.risk_level}</p>
                  <p><strong>Confidence:</strong> {r.confidence}%</p>
                </div>
              ))}

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
