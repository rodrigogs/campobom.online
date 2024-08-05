import { useEffect, useRef, useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import type { Candidate } from './types'
import { Copyright } from './components/Copyright'
import { Header } from './components/Header'
import { Poll } from './components/Poll'
import { Loader } from './components/Loader'
import { Results } from './components/Results'
import { type AlertType, AppAlert, type AppAlertHandle } from './components/AppAlert'
import { GpsValidation } from './components/GpsValidation'
import { filterTitulars, normalizeCandidates } from './candidate-utils'

const client = generateClient<Schema>()

export default function App() {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [voting, setVoting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [locationValidated, setLocationValidated] = useState(false)
  const alertRef = useRef<AppAlertHandle>(null)

  const showAlert = (type: AlertType, text: string, timeout?: number) => {
    alertRef.current?.showAlert(type, text, null, true, timeout)
  }

  const dismissAlert = () => {
    alertRef.current?.dismissAlert()
  }

  const initialize = async () => {
    if (initialized) return

    showAlert('info', 'Carregando candidatos...')

    const { data } = await client.models.Candidate.list({ limit: 1000 })

    const sortedCandidates = data.sort(() => Math.random() - 0.5) as Candidate[]
    const candidates = await normalizeCandidates(sortedCandidates, false)

    setCandidates(candidates)
    setLoading(false)
    dismissAlert()
    setInitialized(true)
  }

  const handleVote = async () => {
    if (voting) return
    if (!selectedCandidateId) return

    try {
      const candidate = candidates.find((c) => c.id === selectedCandidateId)
      if (candidate) {
        setVoting(true)
        showAlert('info', 'Computando voto...')

        const succeed = await client.mutations.castVote({
          uniqueId: `${Math.random()}`, // TODO: We want to implement phone number verification, so we can use the phone number as the uniqueId
          candidateId: candidate.id,
          metadata: JSON.stringify({
            // TODO: Add metadata?
          }),
        })

        if (succeed) setVoted(true)
        else return showAlert('error', 'Erro ao computar voto. Por favor, tente novamente ou reporte o erro para o administrador.')

        showAlert('success', 'Voto computado com sucesso!', 5000)
      } else {
        showAlert('error', 'Candidato não encontrado. Por favor, tenta novamente ou reporte o erro para o administrador.')
      }
    } finally {
      setSelectedCandidateId(null)
      setVoting(false)
    }
  }

  const handleGpsValidationResult = (isValid: boolean) => {
    if (isValid) {
      setLocationValidated(true)
    } else {
      showAlert('error', 'A localização não foi validada. Por favor, tente novamente quando estiver dentro dos limites do município.')
    }
  }

  useEffect(() => {
    initialize()
  })

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
        <Header />

        <AppAlert ref={alertRef} />

        {loading && (
          <Loader />
        )}

        {initialized && !voted && (
          <>
            <Poll
              setSelectedCandidateId={(id) => setSelectedCandidateId(id)}
              candidates={filterTitulars(candidates)}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handleVote}
              disabled={!selectedCandidateId || !locationValidated}
            >
              Votar
            </Button>
          </>
        )}

        {initialized && voted && (
          <Results />
        )}
      </Box>
      <Box sx={{ py: 2 }}>
        <Copyright />
      </Box>

      <GpsValidation
        onValidationResult={handleGpsValidationResult}
      />
    </Container>
  )
}
