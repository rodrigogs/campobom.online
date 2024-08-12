import { defineBackend } from '@aws-amplify/backend'
import { Stack } from 'aws-cdk-lib'
// import { EmailIdentity } from 'aws-cdk-lib/aws-ses'
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
// import { auth } from './auth/resource'
import { data } from './data/resource'
import * as functions from './functions/resources'

const backend = defineBackend({
  // auth,
  data,
  ...functions,
})

// const { cfnUserPool } = backend.auth.resources.cfnResources
// cfnUserPool.policies = {
//   passwordPolicy: {
//     minimumLength: 6,
//     requireLowercase: false,
//     requireNumbers: false,
//     requireSymbols: false,
//     requireUppercase: false,
//     temporaryPasswordValidityDays: 20,
//   },
// }

// const authStack = Stack.of(cfnUserPool)

// const email = EmailIdentity.fromEmailIdentityName(
//   authStack,
//   'EmailIdentity',
//   // your email configured for use in SES
//   process.env.FROM_EMAIL || '',
// )

// cfnUserPool.emailConfiguration = {
//   emailSendingAccount: 'DEVELOPER',
//   sourceArn: email.emailIdentityArn,
// }

backend.castVote.resources.lambda.role?.attachInlinePolicy(
  new Policy(
    Stack.of(backend.data.resources.tables.Vote),
    'DynamoDBPolicy',
    {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'dynamodb:PutItem',
            'dynamodb:Query',
          ],
          resources: [`${backend.data.resources.tables.Vote.tableArn}*`],
        }),
      ],
    },
  ))

backend.seed.resources.lambda.role?.attachInlinePolicy(
  new Policy(
    Stack.of(backend.data.resources.tables.Candidate),
    'DynamoDBPolicy',
    {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'dynamodb:PutItem',
          ],
          resources: [`${backend.data.resources.tables.Candidate.tableArn}*`],
        }),
      ],
    },
  ))

