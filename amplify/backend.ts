import { defineBackend } from '@aws-amplify/backend'
import { Stack } from 'aws-cdk-lib'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import * as functions from './functions/resources'

const backend = defineBackend({
  auth,
  data,
  ...functions,
})

const { cfnUserPool } = backend.auth.resources.cfnResources
cfnUserPool.addPropertyOverride('Policies.PasswordPolicy.MinimumLength', 6)
cfnUserPool.addPropertyOverride('Policies.PasswordPolicy.RequireLowercase', false)
cfnUserPool.addPropertyOverride('Policies.PasswordPolicy.RequireNumbers', false)
cfnUserPool.addPropertyOverride('Policies.PasswordPolicy.RequireSymbols', false)
cfnUserPool.addPropertyOverride('Policies.PasswordPolicy.RequireUppercase', false)

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
