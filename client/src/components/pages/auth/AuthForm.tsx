/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthMode } from '../../../types/auth'
import InputField from '../../common/InputFiled'
import { loginUser, registerUser } from '../../../services/auth.service'
import { userAuthStore } from '@/src/store/userStore'
import Image from 'next/image'

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
    <div className="w-full h-180 flex bg-white/30 backdrop-blur-xl border border-white/10 rounded-3xl drop-shadow-xl">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center w-full">
        {/* Decorative blobs */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative w-80 h-80 xl:w-96 xl:h-96">
            <Image
              src="/images/mother-baby.png"
              alt="Mother and baby illustration"
              fill
              className="object-contain rounded-3xl"
              priority
            />
          </div>
          <div className="text-center max-w-sm">
            <h2 className="text-2xl xl:text-3xl font-bold text-slate-700 text-balance">
              Caring for Every Moment
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Track your journey with confidence. Expert guidance for you and
              your little one, every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-pink-400 to-blue-400 flex items-center justify-center mb-4 shadow-md shadow-pink-200/50">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 text-balance">
                {mode === AuthMode.LOGIN ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="mt-2 text-slate-500 text-sm">
                {mode === AuthMode.LOGIN
                  ? 'Sign in to continue your journey'
                  : 'Start your caring journey today'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 h-10 text-sm rounded-xl bg-linear-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 transition-all duration-300 text-white font-semibold shadow-md shadow-pink-200/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? 'Please wait...'
                  : mode === AuthMode.LOGIN
                    ? 'Sign In'
                    : 'Sign Up'}
              </button>
            </form>

            {/* Toggle */}
            <p className="text-center text-slate-500 mt-6 text-sm">
              {mode === AuthMode.LOGIN
                ? "Don't have an account?"
                : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-1.5 font-semibold text-pink-500 hover:text-pink-600 transition-all duration-300"
              >
                {mode === AuthMode.LOGIN ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}