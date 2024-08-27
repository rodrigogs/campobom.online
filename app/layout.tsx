import './app.css'
import '@/components/ConfigureAmplify'
import { Box, Container, CssBaseline } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { Copyright } from '@/components/Copyright'
import { Header } from '@/components/Header'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/src/theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Campo Bom Online',
  description: 'Campo Bom Online é um projeto de código aberto para a cidade de Campo Bom, RS.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
return (
  <html lang="pt-br">
    <body className={inter.className}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <Header />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
              {children}
            </Box>
            <Box sx={{ py: 2 }}>
              <Copyright />
            </Box>
          </Container>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </body>
  </html>
  )
}
