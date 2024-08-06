import { randomUUID } from 'node:crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { Schema } from '../../data/resource'

const client = new DynamoDBClient({})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export const handler: Schema['castVote']['functionHandler'] = async (event) => {
  const { uniqueId, candidateId, metadata } = event.arguments || {}

  if (!uniqueId || !candidateId) {
    return false
  }

  // Check if the user has already voted
  const queryParams = {
    TableName: process.env.VOTE_TABLE_NAME,
    IndexName: 'uniqueId',
    KeyConditionExpression: 'uniqueId = :uniqueId',
    ExpressionAttributeValues: {
      ':uniqueId': uniqueId,
    },
  }

  try {
    const queryResult = await ddbDocClient.send(new QueryCommand(queryParams))
    if (queryResult.Count && queryResult.Count > 0) {
      // User has already voted
      return false
    }
  } catch (error) {
    console.error('Error querying votes:', error)
    return false
  }

  // Proceed to insert the vote
  const params = {
    TableName: process.env.VOTE_TABLE_NAME,
    Item: {
      id: randomUUID(),
      uniqueId,
      candidateId,
      metadata,
      createdAt: new Date().toISOString(),
    },
  }

  try {
    await ddbDocClient.send(new PutCommand(params))
    return true
  } catch (error) {
    console.error('Error casting vote:', error)
    return false
  }
}
