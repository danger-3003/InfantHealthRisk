/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios"

export const predictSingle = (payload: any) =>
  axiosInstance.post("/predict", payload)

export const predictBulk = (formData: FormData) =>
  axiosInstance.post("/predict/bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

export const exportUserHistory = () =>
  axiosInstance.get("/history/export", {
    responseType: "blob",
  })

export const getHistory = () =>
  axiosInstance.get("/history")
