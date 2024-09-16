import { NextRequest, NextResponse } from 'next/server'
import { AmplifyServer } from '@aws-amplify/core/internals/adapter-core'
import { fetchAuthSession } from 'aws-amplify/auth/server'
import { runWithAmplifyServerContext } from '@/utils/amplify-utils'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // List of exact paths to exclude
  const excludedPaths = [
    '',
    '/',
    '/favicon.ico',
    '/manifest.json',
    '/service-worker.js',
    '/robots.txt',
    '/auth',
    '/pesquisas/eleicoes-municipais-prefeito-2024/resultados',
  ]

  // List of path prefixes to exclude
  const excludedPrefixes = ['/api', '/_next', '/images']

  // Exclude exact paths
  if (excludedPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Exclude paths that start with excluded prefixes
  if (excludedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Proceed with authentication logic
  const response = NextResponse.next()

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec: AmplifyServer.ContextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec, {})
        return session.tokens !== undefined
      } catch (error) {
        console.log(error)
        return false
      }
    },
  })

  if (authenticated) {
    return response
  }

  return NextResponse.redirect(new URL('/auth', request.url))
}

export const config = {
  matcher: '/:path*',
}
