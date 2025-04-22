'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogin = async () => {
    const email = prompt('Inserisci la tua email')
    if (email) {
      await supabase.auth.signInWithOtp({ email })
      alert('Controlla la tua email per il magic link!')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return <button onClick={handleLogout} className="text-sm">Logout</button>
  }

  return <button onClick={handleLogin} className="text-sm">Login</button>
} 