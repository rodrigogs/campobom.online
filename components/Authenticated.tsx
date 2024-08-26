'use client'

import { Authenticator, ThemeProvider, defaultDarkModeOverride, translations } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import { AuthUser } from 'aws-amplify/auth'
import { I18n } from 'aws-amplify/utils'
import config from '@/amplify_outputs.json'

const passwordPolicy = {
  minimumLength: 6,
  requireLowercase: false,
  requireNumbers: false,
  requireSymbols: false,
  requireUppercase: false,
  temporaryPasswordValidityDays: 20,
}

Amplify.configure(config)

I18n.putVocabularies(translations)
I18n.setLanguage('pt')

export function Authenticated({ children }: { children: ({ user, signOut }: { user: AuthUser | undefined, signOut: () => void }) => React.ReactNode }) {
  return <ThemeProvider theme={{ name: 'dark', overrides: [defaultDarkModeOverride] }} colorMode="dark">
      <Authenticator
      initialState="signUp"
      passwordSettings={passwordPolicy}
      formFields={{
        signIn: {
          username: {
            label: 'E-mail',
            placeholder: 'Seu e-mail (@gmail.com)',
          },
        },
        signUp: {
          email: {
            label: 'E-mail',
            placeholder: 'Seu e-mail (@gmail.com)',
          },
          confirm_password: {
            label: 'Confirme a senha',
            placeholder: 'Confirme sua senha',
          },
        },
      }}
    >
      {({ user, signOut }) => (<div className="Authenticated">
        {children({ user, signOut: () => signOut?.() })}
      </div>)}
    </Authenticator>
  </ThemeProvider>
}
