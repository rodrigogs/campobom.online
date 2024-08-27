'use client'

import { Amplify } from 'aws-amplify'
import { I18n } from 'aws-amplify/utils'
import outputs from '@/amplify_outputs.json'
import { translations } from '@aws-amplify/ui-react'

I18n.putVocabularies(translations)
I18n.setLanguage('pt')

Amplify.configure(outputs, { ssr: true })

export function ConfigureAmplifyClientSide() {
  return null
}
