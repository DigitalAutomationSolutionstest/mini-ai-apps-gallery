'use client'

import { useSession, useUser as useSupabaseUser } from '@supabase/auth-helpers-react'

export const useUser = () => {
  const session = useSession()
  const user = useSupabaseUser()

  return {
    session,
    user,
    isLoggedIn: !!user,
  }
} 