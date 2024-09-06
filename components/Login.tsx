'use client'

import type { AuthUser } from 'aws-amplify/auth'
import { Authenticated } from './Authenticated'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export function Login({ user }: { user?: AuthUser }) {
  useEffect(() => {
    if (user) {
      redirect('/')
    }
  }, [user])
  return <Authenticated>{Login}</Authenticated>
}
