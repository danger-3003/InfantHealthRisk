import axiosInstance from "./axios"

export const predictSingle = (payload: any) =>
  axiosInstance.post("/predict", payload)

export const predictBulk = (formData: FormData) =>
  axiosInstance.post("/predict/bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

export const downloadBulkFile = (filename: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/predict/bulk/download/${filename}`
