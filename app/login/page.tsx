// app/login/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for the magic link!')
    }

    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login with Email</h1>
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </main>
  )
}
