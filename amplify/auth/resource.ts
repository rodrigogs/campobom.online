import { defineAuth } from '@aws-amplify/backend'
// import { preSignUp } from './pre-signup/resource'

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  // userAttributes: {
  //   email: {
  //     mutable: false,
  //     required: true,
  //   },
  // },
  loginWith: {
    email: {
      // @see https://github.com/amazon-archives/amazon-cognito-identity-js/issues/512
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Campo Bom Online - Seu código de verificação',
      verificationEmailBody: (createCode) => `Seu código de verificação é ${createCode()}`,
    },
  },
  // accountRecovery: 'EMAIL_ONLY',
  // triggers: {
  //   preSignUp,
  // },
})
