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

export const resetPassword = (email: string, old_password: string, new_password: string) =>
  axiosInstance.post("/auth/reset-password", { email: email, old_password: old_password, new_password: new_password })

export const logoutUser = () => {
  Cookies.remove("auth_token");

  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
