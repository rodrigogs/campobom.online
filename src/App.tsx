import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { Alert, Button } from '@mui/material'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import { Copyright } from './Copyright'
import type { Candidate } from './types'
import { Header } from './Header'
import { Poll } from './Poll'
import { Loader } from './Loader'
import { Results } from './Results'

const client = generateClient<Schema>()

export default function App() {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [voting, setVoting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info'
    text: string
    icon?: string
  } | null>(null)

  const normalizeCandidate = (candidates: Candidate[]) => (candidate: Candidate) => {
    if (candidate.vice) {
      const vice = candidates.find((c) => c.id === candidate.vice)
      candidate.transients = { vice }
    }
    return candidate
  }

  useEffect(() => {
    async function fetchCandidates() {
      console.log('Fetching candidates...')

      try {
        const { data } = await client.models.Candidate.list()

        const typedCandidates = data as Candidate[]
        const candidates = typedCandidates
          .sort(() => Math.random() - 0.5)
          .map(normalizeCandidate(typedCandidates))

        setCandidates(candidates)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    if (!initialized) {
      fetchCandidates()
    }
  })

  const handleVote = async () => {
    if (voting) return
    if (!selectedCandidateId) return

    try {
      const candidate = candidates.find((c) => c.id === selectedCandidateId)
      if (candidate) {
        const updatedCandidate = { ...candidate, votes: (candidate.votes || 0) + 1 }
        const fetchedCandidate = await client.models.Candidate.update(updatedCandidate)

        setCandidates(candidates.map((c) => (c.id === candidate.id
          ? normalizeCandidate(candidates)(fetchedCandidate.data as Candidate) // Kill me, I'm a monster 🤢
          : c)))
        setVoted(true)

        setAlert({
          type: 'success',
          text: 'Voto computado com sucesso!',
        })
      } else {
        setAlert({
          type: 'error',
          text: 'Candidato não encontrado. Por favor, tenta novamente ou reporte o erro para o administrador.',
        })
      }
    } finally {
      setSelectedCandidateId(null)
      setVoting(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
        <Header />

        {alert && (
          <Alert
            severity={alert.type}
            sx={{ width: '100%', marginBottom: 2 }}
            onClose={() => setAlert(null)}
          >
            {alert.text}
          </Alert>
        )}

        {loading && (
          <Loader />
        )}

        {initialized && !voted && (
          <><Poll setSelectedCandidateId={(id) => setSelectedCandidateId(id)} candidates={candidates} />
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handleVote}
              disabled={!selectedCandidateId}
            >
              Votar
            </Button></>
        )}

        {initialized && voted && (
          <Results />
        )}
      </Box>
      <Box sx={{ py: 2 }}>
        <Copyright />
      </Box>
    </Container>
  )
}
