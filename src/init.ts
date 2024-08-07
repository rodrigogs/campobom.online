import type { generateClient } from 'aws-amplify/data'
import type { Candidate } from './types'
import type { Schema } from '../amplify/data/resource'

export default async (client: ReturnType<typeof generateClient<Schema>>) => {
  const createOrUpdateCandidate = async (candidate: Omit<Candidate, 'id'>) => {
    const exists = await client.models.Candidate.list({ filter: { name: { eq: candidate.name  } } })
    if (exists.data?.length) {
      console.log('Candidate already exists:', exists.data[0])
      return client.models.Candidate.update({ ...candidate, id: exists.data[0].id })
    }
    console.log('Creating candidate:', candidate)
    return client.models.Candidate.create(candidate)
  }

  const runOnce = async () => {
    const genifer = await createOrUpdateCandidate({
      type: 'VICE',
      name: 'Genifer Engers',
      photoUrl: '/candidates/genifer-engers.jpeg',
    })
    await createOrUpdateCandidate({
      type: 'MAYOR',
      name: 'Giovani Feltes',
      viceId: genifer.data?.id,
      photoUrl: '/candidates/giovani-feltes.jpg',
    })
    const alex = await createOrUpdateCandidate({
      type: 'VICE',
      name: 'Alex Dias',
      photoUrl: '/candidates/alex-dias.jpeg',
    })
    await createOrUpdateCandidate({
      type: 'MAYOR',
      name: 'Faisal Karam',
      viceId: alex.data?.id,
      photoUrl: '/candidates/faisal-karam.jpg',
    })
    const Benetti = await createOrUpdateCandidate({
      type: 'VICE',
      name: 'Ademir Benetti',
      photoUrl: '/candidates/ademir-benetti.jpg',
    })
    await createOrUpdateCandidate({
      type: 'MAYOR',
      name: 'Victor Souza',
      viceId: Benetti.data?.id,
      photoUrl: '/candidates/victor-souza.jpg',
    })
    await createOrUpdateCandidate({
      type: 'NULL',
      name: 'Nulo',
    })
    await createOrUpdateCandidate({
      type: 'BLANK',
      name: 'Branco',
    })
  }

  const deleteAllCandidates = async () => {
    const { data } = await client.models.Candidate.list({ limit: 1000 })
    console.log('Deleting all candidates:', data)
    for (const candidate of data as Candidate[]) {
      await client.models.Candidate.delete(candidate)
    }
  }

  setTimeout(async () => {
    await deleteAllCandidates()
    await runOnce()
  }, 1000)
}
