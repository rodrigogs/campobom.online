import { defineBackend, defineAuth } from '@aws-amplify/backend'

defineBackend({
  auth: defineAuth({
    loginWith: {
      email: true,
    },
  }),
})
