import * as functions from './functions/resources'
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Stack } from 'aws-cdk-lib'
import { applyUserPoolCustomizations } from './user-pool-customizations'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { defineBackend } from '@aws-amplify/backend'

export const backend = defineBackend({
  auth,
  data,
  ...functions,
})

applyUserPoolCustomizations(backend)

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
