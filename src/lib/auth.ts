/* eslint-disable no-unused-vars */
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { UserRole } from '@prisma/client'
import { AuthenticationError, AuthorizationError } from './errors'

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

interface WithAuthOptions {
  allowedRoles?: UserRole[]
}

export function withAuth(handler: ApiHandler, options: WithAuthOptions = {}) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getSession({ req })
      
      if (!session?.user) {
        throw new AuthenticationError()
      }

      // Check user role if roles are specified
      if (options.allowedRoles?.length) {
        const userRole = req.headers['x-user-role'] as UserRole

        if (!userRole || !options.allowedRoles.includes(userRole)) {
          throw new AuthorizationError()
        }
      }

  // Add user info to request
  (req as any).user = {
        id: req.headers['x-user-id'],
        role: req.headers['x-user-role'],
      }

      await handler(req, res)
      return
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
        res.status(error.statusCode).json({ message: error.message })
        return
      }

      throw error
    }
  }
}