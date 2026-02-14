'use client'


import AuthForm from "../components/AuthForm"


export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-5 bg-linear-to-br from-pink-50 via-white to-blue-50">
      {/* Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      <section className="max-w-300 w-full">
        <AuthForm />
      </section>
    </main>
  )
}