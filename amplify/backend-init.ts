import { applyUserPoolCustomizations } from './user-pool-customizations'
import { auth } from './auth/resource'
import { defineBackend } from '@aws-amplify/backend'

export const backend = defineBackend({
  auth,
})

applyUserPoolCustomizations(backend)
