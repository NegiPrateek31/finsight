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

    // Get content statistics
    const totalPosts = await prisma.post.count()
    const totalComments = await prisma.comment.count()
    const postsThisWeek = await prisma.post.count({
      where: {
        createdAt: {
          gte: weekStart
        }
      }
    })

    // Get post analytics totals
    const analytics = await prisma.postAnalytics.aggregate({
      _sum: {
        views: true,
        likes: true,
      }
    })

    res.status(200).json({
      totalPosts,
      totalComments,
      postsThisWeek,
      analytics: {
        totalViews: analytics._sum?.views || 0,
        totalLikes: analytics._sum?.likes || 0,
      }
    })
    return
  }

  res.status(405).json({ message: 'Method not allowed' })
  return
}