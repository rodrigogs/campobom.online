import { defineFunction } from '@aws-amplify/backend'

export const seed = defineFunction({
  name: 'seed',
  entry: './handler.ts',
  environment: {
    CANDIDATE_TABLE_NAME: process.env.CANDIDATE_TABLE_NAME || 'Candidate',
  },
})
