'use client'

import '@aws-amplify/ui-react/styles.css'
import { components, formFields, passwordSettings } from './customizations'
import { useRouter, useSearchParams } from 'next/navigation'
import { CircularProgress } from '@mui/material'
import { useEffect } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'

function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackURL = searchParams.get('callbackURL') || '/'

  useEffect(() => {
    router.replace(callbackURL)
  }, [router, callbackURL])

  return <CircularProgress />
}

export default withAuthenticator(LoginPage, {
  variation: 'default',
  components,
  passwordSettings,
  formFields,
})
