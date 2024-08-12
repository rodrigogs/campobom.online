import { Amplify } from 'aws-amplify'
import type { Schema } from '../../data/resource'
import amplifyConfig from '../../../amplify_outputs.json'
import { generateClient } from 'aws-amplify/api'
import type { Candidate } from '@src/types'

Amplify.configure(amplifyConfig)

const client = generateClient<Schema>()

const createOrUpdateCandidate = async (candidate: Omit<Candidate, 'id'>) => {
  const exists = await client.models.Candidate.list({ filter: { name: { eq: candidate.name  } } })
  if (exists.data?.length) {
    console.log('Candidate already exists:', exists.data[0])
    return client.models.Candidate.update({ ...candidate, id: exists.data[0].id })
  }
  console.log('Creating candidate:', candidate)
  return client.models.Candidate.create(candidate)
}

const deleteAllCandidates = async () => {
  const { data } = await client.models.Candidate.list({ limit: 1000 })
  await Promise.all(data.map(({ id }) => client.models.Candidate.delete({ id })))
}

export const handler: Schema['seed']['functionHandler'] = async () => {
  await deleteAllCandidates()

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

  return true
}
