// components/SupabaseProvider.tsx
'use client'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { type Session, type SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

interface Props {
  children: React.ReactNode
}

export default function SupabaseProvider({ children }: Props) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
