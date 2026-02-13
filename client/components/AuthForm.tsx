/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthMode } from '../types/auth'
import InputField from './InputFiled'
import { loginUser, registerUser } from '../services/auth.service'
import { userAuthStore } from '@/store/userStore'

export default function AuthForm() {
  const router = useRouter();
  const setUser = userAuthStore((state) => state.setUser);

  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null)

  const toggleMode = () => {
    setMode(prev => (prev === AuthMode.LOGIN ? AuthMode.SIGNUP : AuthMode.LOGIN))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {

      if (mode === AuthMode.LOGIN) {
        const response = await loginUser({
          email,
          password,
        })
        if (response.access_token) {
          setMessage(response.message)
          setUser({ email: response.user.email, name: response.user.name })
          router.push("/home");
          setName('')
          setPassword('')
        }

      } else {
        const response = await registerUser({
          email,
          password,
          name,
        })
        if (response.access_token) {
          setMessage(response.message)
          setUser({ email: response.user.email, name: response.user.name })
          router.push("/home");
          setName('')
          setPassword('')
        }
      }

    } catch (err: unknown) {

      const message =
        (err as any)?.response?.data?.detail ||
        (err as any)?.response?.data?.message ||
        "Something went wrong. Please try again."
      setError(message)

    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="w-full max-w-110 z-10 animate-in fade-in zoom-in duration-500">
      <div className="glass-effect rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-semibold text-white">
            {mode === AuthMode.LOGIN ? 'Welcome Back' : 'Create Account'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === AuthMode.SIGNUP && (
            <InputField
              label="Full Name"
              value={name}
              onChange={setName}
              required={true}
            />
          )}

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required={true}
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required={true}
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white font-medium"
          >
            {isLoading
              ? 'Please wait...'
              : mode === AuthMode.LOGIN
                ? 'Login'
                : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {mode === AuthMode.LOGIN
            ? "Don't have an account?"
            : 'Already have an account?'}
          <button
            onClick={toggleMode}
            className="ml-2 text-indigo-400 hover:text-indigo-300"
          >
            {mode === AuthMode.LOGIN ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}