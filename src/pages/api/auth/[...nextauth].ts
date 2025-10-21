import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: 'database',
  },
  providers: [
    ...(process.env.EMAIL_SERVER && process.env.EMAIL_FROM
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
})
