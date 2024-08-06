import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { castVote } from '../functions/cast-vote'

const schema = a.schema({

  Candidate: a
    .model({
      name: a.string().required(),
      viceId: a.string(),
      photoUrl: a.string(),
      type: a.enum([
        'major',
        'vice',
        'null',
        'blank',
      ]),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Vote: a
    .model({
      uniqueId: a.string().required(),
      candidateId: a.string().required(),
      metadata: a.string(),
      createdAt: a.datetime().required(),
    })
    .secondaryIndexes(index => [
      index('uniqueId'),
      index('candidateId'),
    ])
    .authorization((allow) => [allow.publicApiKey()]),

  castVote: a
    .mutation()
    .arguments({
      uniqueId: a.string().required(),
      candidateId: a.string().required(),
      metadata: a.string(),
    })
    .handler(a.handler.function(castVote))
    .returns(a.boolean())
    .authorization((allow) => [allow.publicApiKey()]),
})

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})
