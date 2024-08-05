import { defineFunction } from '@aws-amplify/backend'

export const castVote = defineFunction({
  name: 'cast-vote',
  entry: './handler.ts',
  environment: {
    VOTE_TABLE_NAME: process.env.VOTE_TABLE_NAME || 'Vote',
  },
})
