import { Amplify } from 'aws-amplify'
import type { Schema } from '../../data/resource'
import amplifyConfig from '../../../amplify_outputs.json'
import { generateClient } from 'aws-amplify/api'

Amplify.configure(amplifyConfig)

const client = generateClient<Schema>()

export const handler: Schema['castVote']['functionHandler'] = async (event) => {
  const { uniqueId, candidateId, metadata } = event.arguments || {}

  if (!uniqueId || !candidateId) {
    return false
  }

  // Check if the user has already voted
  const { data } = await client.models.Vote.listVoteByUniqueId({ uniqueId })

  if (data.length > 0) {
    return false
  }

  // Proceed to insert the vote
  await client.models.Vote.create({
    uniqueId,
    candidateId,
    metadata,
    createdAt: new Date().toISOString(),
  })

  return true
}
