import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import theme from './theme'
import App from './App'

Amplify.configure(outputs)

// biome-ignore lint/style/noNonNullAssertion: Ignore the non-null assertion for the root element
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
