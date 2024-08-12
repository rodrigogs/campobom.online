import { defineBackend } from '@aws-amplify/backend'
import { Stack } from 'aws-cdk-lib'
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { auth } from './auth/resource'
import { data } from './data/resource'
import * as functions from './functions/resources'
import userPoolCustomizations from './user-pool-customizations'

export const backend = defineBackend({
  auth,
  data,
  ...functions,
})

userPoolCustomizations(backend)

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
