/* eslint-disable no-unused-vars */
import { DefaultSession, DefaultUser } from 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: DefaultUser & {
      id: string
      role: UserRole
    }
  }
  
  interface User extends DefaultUser {
    id: string
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}