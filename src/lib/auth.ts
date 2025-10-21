// negiprateek31/finsight/finsight-1382f5b01244365c9a92f06365cf1e52dc019117/src/lib/auth.ts
/* eslint-disable no-unused-vars */
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { UserRole } from '@prisma/client'
import prisma from './prisma' // Assuming ./prisma refers to src/lib/prisma
import { AuthenticationError, AuthorizationError } from './errors'

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

interface WithAuthOptions {
  allowedRoles?: UserRole[]
}

export function withAuth(handler: ApiHandler, options: WithAuthOptions = {}) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getSession({ req })
      
      if (!session?.user?.email) {
        throw new AuthenticationError()
      }

      // 1. Fetch user from DB to get latest role and ID securely
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
      })

      if (!user) {
        throw new AuthenticationError('User profile not found in database.')
      }

      // 2. Check user role if roles are specified
      if (options.allowedRoles?.length) {
        if (!options.allowedRoles.includes(user.role)) {
          throw new AuthorizationError()
        }
      }

      // 3. Attach secure user info (from DB) to the request object
      (req as any).user = {
        id: user.id,
        role: user.role,
      }

      // FIX: Ensure the wrapped handler's return value is not propagated by using 'await' 
      // and explicitly returning nothing from the wrapper function after the handler executes.
      await handler(req, res)
      return
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
        res.status(error.statusCode).json({ message: error.message })
        return
      }

      // If another type of error occurs, let Next.js handle it as a 500
      throw error 
    }
  }
}