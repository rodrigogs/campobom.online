import { generateClient } from 'aws-amplify/data'
import type { Candidate } from './types'
import type { Schema } from '../amplify/data/resource'

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

export const filterTitulars = (candidates: Candidate[]) => candidates.filter((c) => c.viceId)
