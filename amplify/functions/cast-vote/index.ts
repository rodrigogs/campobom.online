import { defineFunction } from '@aws-amplify/backend'

export const castVote = defineFunction({
  name: 'cast-vote',
  entry: './handler.ts',
})
