import { type Schema } from '@/amplify/data/resource'
import { cookies } from 'next/headers'
import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api'
import { getCurrentUser } from 'aws-amplify/auth/server'
import outputs from '@/amplify_outputs.json'

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
})

export const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
})

export async function AuthGetCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    })
    return currentUser
  } catch (error) {
    console.error(error)
  }
}
