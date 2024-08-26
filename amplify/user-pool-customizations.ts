import type { backend as Backend } from './backend'
import type { backend as BackendInit } from './backend-init'
import { EmailIdentity } from 'aws-cdk-lib/aws-ses'
import { Stack } from 'aws-cdk-lib'

const passwordPolicy = {
  minimumLength: 6,
  requireLowercase: false,
  requireNumbers: false,
  requireSymbols: false,
  requireUppercase: false,
  temporaryPasswordValidityDays: 20,
}

export const applyUserPoolCustomizations = (backend: typeof Backend | typeof BackendInit) => {
  const { cfnUserPool } = backend.auth.resources.cfnResources
  cfnUserPool.policies = {
    passwordPolicy,
  }

  const authStack = Stack.of(cfnUserPool)

  const email = EmailIdentity.fromEmailIdentityName(
    authStack,
    'EmailIdentity',
    // your email configured for use in SES
    process.env.FROM_EMAIL ?? '',
  )

  cfnUserPool.emailConfiguration = {
    emailSendingAccount: 'DEVELOPER',
    sourceArn: email.emailIdentityArn,
  }
}
