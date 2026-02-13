import { userAuthStoreType, } from "@/types/zustandStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const userAuthStore = create<userAuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null })
    }),
    {
      name: "userAuthStore"
    }
  )
)