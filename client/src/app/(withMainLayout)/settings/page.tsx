/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { logoutUser } from "@/src/services/auth.service"
import { resetPassword } from "@/src/services/auth.service"
import { userAuthStore } from "@/src/store/userStore"
import InputField from "@/src/components/common/InputFiled"

export default function SettingsPage() {
  const user = userAuthStore((state) => state.user)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      if (!user?.email) {
        alert("User email not found")
        return
      }

      await resetPassword(
        user.email,
        currentPassword,
        newPassword,
      )

      alert("Password updated successfully")

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-10 mx-auto">
      <h1 className="text-2xl font-semibold text-pink-600 mb-6">
        Settings
      </h1>

      {/* PROFILE SECTION */}
      <div className="bg-white border border-pink-200 rounded-2xl p-6 shadow-sm mb-6 max-w-xl">
        <h2 className="text-xl font-semibold text-pink-600 mb-6">
          Profile Information
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-medium text-slate-800">{user?.name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium text-slate-800">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD SECTION */}
      <div className="bg-white mb-10 max-w-xl">
        <h2 className="text-xl font-semibold text-pink-600 mb-6">
          Change Password
        </h2>

        <div className="space-y-4">
          <div>
            <InputField
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e)}
            />
          </div>

          <div>
            <InputField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e)}
            />
          </div>

          <div>
            <InputField
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e)}
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full mt-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white duration-300 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  )
}
