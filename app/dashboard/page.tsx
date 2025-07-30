'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [dietary, setDietary] = useState('')
  const [mealType, setMealType] = useState('')
  const [timeLimit, setTimeLimit] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
      } else {
        setUserEmail(session.user.email ?? null)
      }

      setCheckingSession(false)
    }

    getSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          ingredients: ingredients.split(',').map((i) => i.trim()),
          cuisine,
          dietary,
          mealType,
          timeLimit,
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      setResult(data.recipe || 'No recipe found.')
    } catch (error) {
      console.error('Error generating recipe:', error)
      setResult('Failed to generate recipe.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) return null

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🍽️ AI Recipe Generator</h1>
      <p className="text-center text-sm text-gray-500">Logged in as: {userEmail}</p>

      {result && (
        <div className="bg-yellow-50 p-4 border border-yellow-300 rounded shadow whitespace-pre-wrap">
          {result}
        </div>
      )}

      <form onSubmit={handleGenerate} className="grid gap-4">
        <input
          type="text"
          placeholder="🧄 Ingredients (e.g. onion, tomato, chicken)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="🌍 Cuisine Type (e.g. Italian, Chinese)"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="🥗 Dietary Preference (e.g. vegan, gluten-free)"
          value={dietary}
          onChange={(e) => setDietary(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="🍽️ Meal Type (e.g. breakfast, dinner)"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="⏱️ Time Limit (optional, e.g. under 30 mins)"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Generating Recipe...' : 'Generate Recipe'}
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="text-sm text-red-600 underline mt-10 block text-center hover:text-red-800"
      >
        Logout
      </button>
    </main>
  )
}
