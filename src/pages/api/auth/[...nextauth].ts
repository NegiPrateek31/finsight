// negiprateek31/finsight/finsight-1382f5b01244365c9a92f06365cf1e52dc019117/src/pages/api/auth/[...nextauth].ts
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  adapter: PrismaAdapter(prisma as any),
  // FIX: Change session strategy to 'jwt' to allow custom callbacks for user role/ID
  session: {
    strategy: 'jwt',
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
  // FIX: Add callbacks to securely inject user ID and role into the token and session
  callbacks: {
    // Inject ID and role into the JWT on sign in or token rotation
    async jwt({ token, user }) {
      if (user?.email) {
        // Fetch user from DB only once on sign-in/first JWT generation
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true }
        })

        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
        }
      }
      return token
    },
    // Pass ID and role from JWT to the session object for client-side use
    async session({ session, token }) {
      if (session.user && token.id && token.role) {
        (session.user as any).id = token.id
        (session.user as any).role = token.role
      }
      return session
    },
  },
})