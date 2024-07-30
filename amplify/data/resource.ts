import { type ClientSchema, a, defineData } from "@aws-amplify/backend"

const schema = a.schema({

  Candidate: a
    .model({
      name: a.string().required(),
      votes: a.integer().default(0),
      vice: a.string(),
      photoUrl: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})
