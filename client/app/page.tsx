'use client'


import AuthForm from "../components/AuthForm"


export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 overflow-hidden relative">
      {/* Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>


      <AuthForm />
    </main>
  )
}