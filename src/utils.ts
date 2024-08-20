import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'
import type { Schema } from '../amplify/data/resource'
import type { Candidate } from './types'
import type { AlertType, AppAlertHandle } from './components/AppAlert'

const client = generateClient<Schema>()

const retrieveVotes = async (candidate: Candidate) => {
  const { data, errors } = await client.models.Vote.listVoteByCandidateId({ candidateId: candidate.id })

  if (errors) {
    console.error('Error loading votes:', errors)
    throw new Error(errors.join(', '))
  }

  return data.length
}

const normalizeCandidate = (candidates: Candidate[], loadVotes: boolean ) => async (candidate: Candidate) => {
  const vice = candidates.find((c) => c.id === candidate.viceId)
  const votes = loadVotes ? await retrieveVotes(candidate) : undefined
  return { ...candidate, transients: { vice, votes } }
}

export const normalizeCandidates = (candidates: Candidate[], loadVotes: boolean) => {
  return Promise.all(candidates.map(normalizeCandidate(candidates, loadVotes)))
}

export const filterTitulars = (candidates: Candidate[]) => candidates.filter((c) => c.type === 'MAYOR' || c.type === 'NULL' || c.type === 'BLANK')

export const showAlert = (alertRef: React.RefObject<AppAlertHandle>) => (type: AlertType, text: string, timeout?: number) => {
  alertRef.current?.showAlert(type, text, null, true, timeout)
}

export const dismissAlert = (alertRef: React.RefObject<AppAlertHandle>) => () => {
  alertRef.current?.dismissAlert()
}

interface InitializeAppProps {
  client: ReturnType<typeof generateClient<Schema>>
  setInitialized: React.Dispatch<React.SetStateAction<boolean>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>
  setVoted: React.Dispatch<React.SetStateAction<boolean>>
  setLocationValidated: React.Dispatch<React.SetStateAction<boolean>>
  showAlert: (type: AlertType, text: string, timeout?: number) => void
  dismissAlert: () => void
}

export const initializeApp = async ({
  client,
  setInitialized,
  setLoading,
  setCandidates,
  setVoted,
  setLocationValidated,
  showAlert,
  dismissAlert,
}: InitializeAppProps) => {
  showAlert('info', 'Carregando candidatos...')

  try {
    const { data } = await client.models.Candidate.list({ limit: 1000 })

    const sortedCandidates = data
      .filter(c => c.type === 'MAYOR' || c.type === 'VICE')
      .sort(() => Math.random() - 0.5)

    const sortedOptions = data
      .filter(c => c.type === 'NULL' || c.type === 'BLANK')
      .sort((a, b) => (a.type === 'NULL' ? 1 : a.type === 'BLANK' ? 2 : 0) - (b.type === 'NULL' ? 1 : b.type === 'BLANK' ? 2 : 0))

    const rawCandidates = [...sortedCandidates, ...sortedOptions] as Candidate[]
    const normalizedCandidates = await normalizeCandidates(rawCandidates, false)

    setCandidates(normalizedCandidates)

    const { userId } = await getCurrentUser()
    const voted = (await client.models.Vote.listVoteByUniqueId({ uniqueId: userId })).data.length > 0

    if (voted) {
      setVoted(true)
      setLocationValidated(true)
    }

    setInitialized(true)
  } catch (error) {
    showAlert('error', 'Erro ao carregar candidatos. Por favor, tente novamente.')
  } finally {
    setLoading(false)
    dismissAlert()
  }
}
