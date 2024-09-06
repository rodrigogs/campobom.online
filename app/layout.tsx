import './app.css'
import { Box, Container, CssBaseline } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ConfigureAmplifyClientSide } from '@/components/ConfigureAmplify'
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
  applicationName: 'Campo Bom Online',
  abstract: 'Campo Bom Online é um projeto de código aberto para a cidade de Campo Bom, RS.',
  appleWebApp: {
    title: 'Campo Bom Online',
  },
  authors: [{ name: 'Rodrigo Gomes da Silva', url: 'https://github.com/rodrigogs' }],
  icons: [
    {
    rel: 'icon',
    url: 'https://www.campobom.online/favicon.ico',
    },
    {
      rel: 'android-chrome-192x192',
      url: 'https://www.campobom.online/images/android-chrome-192x192.png',
    },
    {
      rel: 'android-chrome-512x512',
      url: 'https://www.campobom.online/images/android-chrome-512x512.png',
    },
    {
      rel: 'apple-touch-icon',
      url: 'https://www.campobom.online/images/apple-touch-icon.png',
    },
    {
      rel: 'favicon-16x16',
      url: 'https://www.campobom.online/images/favicon-16x16.png',
    },
    {
      rel: 'favicon-32x32',
      url: 'https://www.campobom.online/images/favicon-32x32.png',
    },
  ],
  keywords: ['campo bom', 'rs', 'prefeitura', 'câmara', 'vereadores', 'eleições', 'cidadania', 'participação', 'política', 'transparência', 'governo', 'município', 'cidade', 'estado', 'brasil'],
  openGraph: {
    title: 'Campo Bom Online',
    description: 'Campo Bom Online é um projeto de código aberto para a cidade de Campo Bom, RS.',
    url: 'https://www.campobom.online',
    type: 'website',
    images: [
      {
        url: 'https://www.campobom.online/images/logo.png',
        alt: 'Campo Bom Online',
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: '@campobomonline',
    title: 'Campo Bom Online',
    description: 'Campo Bom Online é um projeto de código aberto para a cidade de Campo Bom, RS.',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
return (
  <html lang="pt-br">
    <body className={inter.className}>
      <ConfigureAmplifyClientSide />
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
