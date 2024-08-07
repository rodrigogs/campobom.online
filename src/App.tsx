import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { generateClient } from 'aws-amplify/data'
import { Authenticator, defaultDarkModeOverride, ThemeProvider } from '@aws-amplify/ui-react'
import { I18n } from 'aws-amplify/utils'
import { translations } from '@aws-amplify/ui-react'
import type { AuthUser } from 'aws-amplify/auth'
import type { Candidate } from './types'
import type { Schema } from '../amplify/data/resource'
import { initializeApp, showAlert, dismissAlert } from './utils'
import { AppAlert, type AppAlertHandle } from './components/AppAlert'
import { Header } from './components/Header'
import { Poll } from './components/Poll'
import { Loader } from './components/Loader'
import { Results } from './components/Results'
import { VoteButton } from './components/VoteButton'
import { GpsValidation } from './components/GpsValidation'
import { Copyright } from './components/Copyright'
import '@aws-amplify/ui-react/styles.css'

I18n.putVocabularies(translations)
I18n.setLanguage('pt')

const client = generateClient<Schema>()

const enableAuth = import.meta.env.VITE_APP_ENABLE_AUTH === 'true'
const enableGPS = import.meta.env.VITE_APP_ENABLE_AUTH === 'true'

const App = () => {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [voting, setVoting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [locationValidated, setLocationValidated] = useState(!enableGPS)
  const alertRef = useRef<AppAlertHandle>(null)

  useEffect(() => {
    initializeApp({
      client,
      setInitialized,
      setLoading,
      setCandidates,
      showAlert: showAlert(alertRef),
      dismissAlert: dismissAlert(alertRef),
    })
  }, [])

  const handleVote = useCallback((user?: AuthUser) => async () => {
    if (enableAuth && !user) return
    if (voting) return
    if (!selectedCandidateId) return

    try {
      setVoting(true)
      showAlert(alertRef)('info', 'Computando voto...')

      const candidate = candidates.find(c => c.id === selectedCandidateId)
      if (!candidate) {
        showAlert(alertRef)('error', 'Candidato não encontrado. Por favor, tente novamente.')
        return
      }

      const { data: succeed, errors } = await client.mutations.castVote({
        uniqueId: user?.userId || `${Math.random()}`,
        candidateId: candidate.id,
        metadata: JSON.stringify({}),
      })

      if (errors) {
        return showAlert(alertRef)('error', 'Erro ao computar voto. Por favor, tente novamente.')
      }

      if (succeed) {
        setVoted(true)
        showAlert(alertRef)('success', 'Voto computado com sucesso!', 5000)
      } else {
        showAlert(alertRef)('error', 'Erro ao computar voto. Por favor, tente novamente.')
      }
    } catch (error) {
      showAlert(alertRef)('error', 'Erro ao computar voto. Por favor, tente novamente.')
    } finally {
      setVoting(false)
      setSelectedCandidateId(null)
    }
  }, [voting, selectedCandidateId, candidates])

  const handleGpsValidationResult = useCallback((isValid: boolean) => {
    if (isValid) {
      setLocationValidated(true)
    } else {
      showAlert(alertRef)('error', 'A localização não foi validada. Por favor, tente novamente dentro dos limites do município.')
    }
  }, [])

  const sortedCandidates = useMemo(() => {
    const sortedCandidatesList = candidates
      .filter(c => c.type === 'MAYOR' || c.type === 'VICE')
      .sort(() => Math.random() - 0.5)

    const sortedOptions = candidates
      .filter(c => c.type === 'NULL' || c.type === 'BLANK')
      .sort((a, b) => (a.type === 'NULL' ? 1 : a.type === 'BLANK' ? 2 : 0) - (b.type === 'NULL' ? 1 : b.type === 'BLANK' ? 2 : 0))

    const titularCandidates = sortedCandidatesList.filter(c => c.type === 'MAYOR')

    return [...titularCandidates, ...sortedOptions] as Candidate[]
  }, [candidates])

  const renderContent = (user?: AuthUser) => (
    <>
      <AppAlert ref={alertRef} />
      {loading && <Loader />}
      {initialized && !voted && (
        <>
          <Poll setSelectedCandidateId={setSelectedCandidateId} candidates={sortedCandidates} />
          <VoteButton handleVote={handleVote(user)} disabled={loading || voting || !selectedCandidateId || !locationValidated} />
        </>
      )}
      {initialized && voted && <Results />}
    </>
  )

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
        <Header />
        {enableAuth ? (
          <ThemeProvider theme={{ name: 'dark', overrides: [defaultDarkModeOverride] }} colorMode="dark">
            <Authenticator
              initialState="signUp"
              formFields={{
                signIn: { username: { dialCode: '+55', placeholder: 'Seu número de telefone' } },
                signUp: { phone_number: { dialCode: '+55', placeholder: 'Seu número de telefone' } },
              }}
              passwordSettings={{
                minLength: 6,
                requireLowercase: false,
                requireNumbers: false,
                requireUppercase: false,
                requireSpecialCharacters: false,
              }}
            >
              {({ user }) => <>{renderContent(user)}</>}
            </Authenticator>
          </ThemeProvider>
        ) : (
          renderContent()
        )}
      </Box>
      <Box sx={{ py: 2 }}>
        <Copyright />
      </Box>
      {enableGPS && <GpsValidation onValidationResult={handleGpsValidationResult} />}
    </Container>
  )
}

export default App
