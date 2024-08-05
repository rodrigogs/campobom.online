import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { castVote } from './functions/cast-vote'
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Stack } from 'aws-cdk-lib'

const backend = defineBackend({
  auth,
  data,
  castVote,
})

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
          resources: [backend.data.resources.tables.Vote.tableArn],
        }),
      ],
    },
  ))

// const dataResources = backend.data.resources

// const normalizeVariableName = (name: string) => {
//   return name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase()
// }

// for (const [name, table] of Object.entries(dataResources.tables)) {
//   const variableName = `${normalizeVariableName(name)}_TABLE_NAME`
//   @see https://github.com/aws-amplify/amplify-category-api/issues/2577
//   setDotenvValue(variableName, JSON.stringify(table.tableName))
// }
