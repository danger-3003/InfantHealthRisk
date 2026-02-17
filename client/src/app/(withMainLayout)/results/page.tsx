/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { exportUserHistory, getHistory } from "@/src/services/predict.service"
import { Download } from "lucide-react"

interface ConditionResult {
  condition: string
  risk_level: string
  confidence: number
}

interface RecordItem {
  date: string
  input_data: any[]
  result: {
    name: string
    results: ConditionResult[]
  }[]
}

export default function HistoryPage() {
  const [data, setData] = useState<RecordItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleExport = async () => {
    try {
      const response = await exportUserHistory()

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "My_Prediction_History.xlsx"
      document.body.appendChild(link)
      link.click()

      link.remove()
    } catch (error) {
      console.error("Export failed", error)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await getHistory()
      setData(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "text-red-600 font-semibold"
      case "medium":
        return "text-yellow-600 font-semibold"
      case "low":
        return "text-green-600 font-semibold"
      default:
        return ""
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-pink-600">
          Prediction History
        </h1>
        <button
          className="px-4 py-1 border border-pink-200 hover:border-pink-400 hover:bg-pink-50 duration-300 rounded-full shadow-sm flex items-center justify-between gap-3 text-sm"
          onClick={() => { handleExport() }}
        >
          Export
          <Download size={14} />
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border border-pink-200 rounded-lg shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-pink-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Jaundice</th>
              <th className="px-4 py-3">Cardiac</th>
              <th className="px-4 py-3">Respiratory</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((record, index) => {
              const prediction = record.result[0]
              const conditions = prediction.results

              const jaundice = conditions.find(c => c.condition === "Jaundice")
              const cardiac = conditions.find(c => c.condition === "Cardiac")
              const respiratory = conditions.find(c => c.condition === "Respiratory")

              return (
                <tr
                  key={index}
                  onClick={() => setSelectedRecord(record)}
                  className="border-t border-pink-100 hover:bg-pink-50 cursor-pointer duration-200"
                >
                  <td className="px-4 py-3 font-medium">
                    {prediction.name}
                  </td>

                  <td className={`px-4 py-3 ${getRiskColor(jaundice?.risk_level || "")}`}>
                    {jaundice?.risk_level} ({Math.round((jaundice?.confidence || 0) * 100)}%)
                  </td>

                  <td className={`px-4 py-3 ${getRiskColor(cardiac?.risk_level || "")}`}>
                    {cardiac?.risk_level} ({Math.round((cardiac?.confidence || 0) * 100)}%)
                  </td>

                  <td className={`px-4 py-3 ${getRiskColor(respiratory?.risk_level || "")}`}>
                    {respiratory?.risk_level} ({Math.round((respiratory?.confidence || 0) * 100)}%)
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    {new Date(record.date).toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-2xl relative animate-fadeIn  max-h-[70vh] overflow-y-scroll">

            {/* Close Button */}
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg duration-300"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center text-pink-600">
              Detailed Prediction
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {/* Prediction Results */}
              {selectedRecord.result[0].results.map((r, i) => (
                <div
                  key={i}
                  className="mb-4 p-4 bg-pink-50 rounded-xl border border-pink-200"
                >
                  <p><span className="font-semibold">Condition:</span> {r.condition}</p>
                  <p>
                    <span className="font-semibold">Risk Level:</span>{" "}
                    <span className={getRiskColor(r.risk_level)}>
                      {r.risk_level}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Likelihood:</span>{" "}
                    {Math.round(r.confidence * 100)}%
                  </p>
                </div>
              ))}
            </div>

            {/* INPUT PARAMETERS (2 COLUMN GRID) */}
            <h3 className="text-lg font-semibold mt-6 mb-4 text-slate-700">
              Input Parameters
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(selectedRecord.input_data[0]).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 text-sm"
                >
                  <p className="font-semibold text-slate-600 capitalize">
                    {key.replace(/_/g, " ")}:
                  </p>
                  <p className="text-slate-800">{String(value)}</p>
                </div>
              ))}
            </div>

            {/* Close Button Bottom */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setSelectedRecord(null)}
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
