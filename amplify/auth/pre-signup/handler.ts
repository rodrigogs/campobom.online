import type { PostConfirmationTriggerHandler } from 'aws-lambda'

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const userEmailDomain = event.request.userAttributes.email.split('@')[1]
  if (userEmailDomain === 'gmail.com') {
    return event
  }

  throw new Error('o email deve ser do domínio gmail.com')
}
