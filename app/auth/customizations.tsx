import {
  Box,
  Button,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
  Typography,
} from '@mui/material'
import React from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'

export const passwordSettings = {
  minimumLength: 6,
  requireLowercase: false,
  requireNumbers: false,
  requireSymbols: false,
  requireUppercase: false,
  temporaryPasswordValidityDays: 20,
}

export const components = {
  SignIn: {
    Header() {
      return (
        <Typography variant="h5" align="center" gutterBottom>
          Faça login na sua conta
        </Typography>
      )
    },
    Footer() {
      const { toForgotPassword } = useAuthenticator()
      return (
        <Box textAlign="center">
          <Button variant="text" onClick={toForgotPassword}>
            Redefinir senha
          </Button>
        </Box>
      )
    },
  },

  SignUp: {
    Header() {
      return (
        <Typography variant="h5" align="center" gutterBottom>
          Crie uma nova conta
        </Typography>
      )
    },
    Footer() {
      const { toSignIn } = useAuthenticator()
      return (
        <Box textAlign="center">
          <Button variant="text" onClick={toSignIn}>
            Voltar para o login
          </Button>
        </Box>
      )
    },
  },

  ConfirmSignUp: {
    Header() {
      return (
        <Typography variant="h5" align="center" gutterBottom>
          Insira as informações:
        </Typography>
      )
    },
    Footer() {
      return (
        <Typography variant="body2" align="center">
          Informações do rodapé
        </Typography>
      )
    },
  },

  SetupTotp: {
    Header() {
      return (
        <Typography variant="h5" align="center" gutterBottom>
          Insira as informações:
        </Typography>
      )
    },
    Footer() {
      return (
        <Typography variant="body2" align="center">
          Informações do rodapé
        </Typography>
      )
    },
  },

  ConfirmSignIn: {
    Header() {
      return (
        <Typography variant="h5" align="center" gutterBottom>
          Insira as informações:
        </Typography>
      )
    },
    Footer() {
      return (
        <Typography variant="body2" align="center">
          Informações do rodapé
        </Typography>
      )
    },
  },

  ForgotPassword: {
    Header() {
      return (
        <Typography variant="h5" align="center" gutterBottom>
          Insira as informações:
        </Typography>
      )
    },
    Footer() {
      return (
        <Typography variant="body2" align="center">
          Informações do rodapé
        </Typography>
      )
    },
  },

  ConfirmResetPassword: {
    Header() {
      return (
        <Typography variant="h5" align="center" gutterBottom>
          Insira as informações:
        </Typography>
      )
    },
    Footer() {
      return (
        <Typography variant="body2" align="center">
          Informações do rodapé
        </Typography>
      )
    },
  },
}

export const formFields = {
  signIn: {
    username: {
      placeholder: 'Digite seu e-mail',
      component: (props: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, 'variant'>) => (
        <TextField
          fullWidth
          label="E-mail"
          placeholder="Digite seu e-mail"
          variant="outlined"
          margin="normal"
          {...props}
        />
      ),
    },
    password: {
      placeholder: 'Digite sua senha',
      component: (props: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, 'variant'>) => (
        <TextField
          fullWidth
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          variant="outlined"
          margin="normal"
          {...props}
        />
      ),
    },
  },

  signUp: {
    username: {
      placeholder: 'Digite seu e-mail',
    },
    password: {
      placeholder: 'Digite sua senha:',
      isRequired: false,
      order: 1,
    },
    confirm_password: {
      placeholder: 'Confirme a senha:',
      order: 2,
    },
  },
}
