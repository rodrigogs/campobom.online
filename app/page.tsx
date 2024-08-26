'use client'

import '@aws-amplify/ui-react/styles.css'
import { AppAlert, type AppAlertHandle } from '@/components/AppAlert'
import { dismissAlert, initializeApp, showAlert } from '@/app/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AuthUser } from 'aws-amplify/auth'
import { Authenticated } from '@/components/Authenticated'
import type { Candidate } from '@/src/types'
import { GpsValidation } from '@/components/GpsValidation'
import { Loader } from '@/components/Loader'
import { Poll } from '@/components/Poll'
import { Results } from '@/components/Results'
import { Schema } from '@/amplify/data/resource'
import { VoteButton } from '@/components/VoteButton'
import { generateClient } from 'aws-amplify/data'

const client = generateClient<Schema>()

const enableAuth = process.env.VITE_APP_ENABLE_AUTH === 'true'
const enableGPS = process.env.VITE_APP_ENABLE_GPS === 'true'

const Home = () => {
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
      setInitialized,
      setLoading,
      setCandidates,
      setVoted,
      setLocationValidated,
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
        uniqueId: user?.userId ?? `${Math.random()}`,
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

  return <Authenticated>
    {({ user }) => (<div>
      <AppAlert ref={alertRef} />
      {loading && <Loader />}
      {enableGPS && !locationValidated && <GpsValidation onValidationResult={handleGpsValidationResult} />}
      {initialized && (!voted && locationValidated) && (
        <>
          <Poll setSelectedCandidateId={setSelectedCandidateId} candidates={sortedCandidates} />
          <VoteButton handleVote={handleVote(user)} disabled={loading || voting || !selectedCandidateId || !locationValidated} />
        </>
      )}
      {initialized && (voted || !locationValidated) && <Results />}
    </div>)}
  </Authenticated>
}

export default Home
