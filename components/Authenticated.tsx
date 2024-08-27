'use client'

import { Authenticator, ThemeProvider, defaultDarkModeOverride } from '@aws-amplify/ui-react'
import { AuthUser } from 'aws-amplify/auth'

const passwordPolicy = {
  minimumLength: 6,
  requireLowercase: false,
  requireNumbers: false,
  requireSymbols: false,
  requireUppercase: false,
  temporaryPasswordValidityDays: 20,
}

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
