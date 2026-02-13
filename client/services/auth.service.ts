import axiosInstance from "./axios"
import Cookies from "js-cookie";

export const registerUser = async (data: {
  email: string
  password: string
  name: string
}) => {
  const res = await axiosInstance.post("/auth/register", data);
  const token = res.data?.access_token;

  if (token) {
    Cookies.set("auth_token", token);
  }

  return res.data;
}

export const loginUser = async (data: {
  email: string
  password: string
}) => {
  const res = await axiosInstance.post("/auth/login", data);
  const token = res.data?.access_token;

  if (token) {
    Cookies.set("auth_token", token);
  }

  return res.data;
}

export const resetPassword = (email: string) =>
  axiosInstance.post("/auth/reset-password", { email })
