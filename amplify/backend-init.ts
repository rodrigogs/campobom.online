import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import userPoolCustomizations from './user-pool-customizations'

export const backend = defineBackend({
  auth,
})

userPoolCustomizations(backend)
