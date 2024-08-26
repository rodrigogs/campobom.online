import '@/amplify/utils/init'
import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'

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
