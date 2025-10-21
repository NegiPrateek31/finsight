import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import { startOfWeek } from 'date-fns'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session?.user?.email) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (user?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Not authorized' })
    return
  }

  if (req.method === 'GET') {
    const weekStart = startOfWeek(new Date())

    // Get user statistics
    const totalUsers = await prisma.user.count()
    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: weekStart
        }
      }
    })

    // Get active users (users who have posted/commented/liked in the last week)
    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          {
            posts: {
              some: {
                createdAt: {
                  gte: weekStart
                }
              }
            }
          },
          {
            comments: {
              some: {
                createdAt: {
                  gte: weekStart
                }
              }
            }
          },
          {
            likes: {
              some: {
                createdAt: {
                  gte: weekStart
                }
              }
            }
          }
        ]
      }
    })

    res.status(200).json({
      totalUsers,
      newUsersThisWeek,
      activeUsers
    })
    return
  }

  res.status(405).json({ message: 'Method not allowed' })
  return
}