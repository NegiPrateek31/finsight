import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session?.user?.email) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  if (req.method === 'GET') {
    const { postId } = req.query

    if (typeof postId !== 'string') {
      res.status(400).json({ message: 'Invalid post ID' })
      return
    }

  const analytics = await prisma.postAnalytics.findUnique({
      where: { postId },
      include: {
        post: {
          select: {
            title: true,
            authorId: true,
          },
        },
      },
    })

    if (!analytics) {
      res.status(404).json({ message: 'Analytics not found' })
      return  
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    // Only allow post author or admins/moderators to view analytics
    if (user?.id !== analytics.post.authorId && user?.role === 'USER') {
      res.status(403).json({ message: 'Not authorized' })
      return
    }

    res.status(200).json(analytics)
    return  
  }

  if (req.method === 'POST') {
    const { postId, type } = req.body

    if (!postId || !type) {
      res.status(400).json({ message: 'Missing required fields' })
      return
    }

    const validTypes = ['view', 'share', 'save']
    if (!validTypes.includes(type)) {
      res.status(400).json({ message: 'Invalid analytics type' })
      return
    }

    // Create or update analytics
  const analytics = await prisma.postAnalytics.upsert({
      where: { postId },
      create: {
        postId,
        [type + 's']: 1,
      },
      update: {
        [type + 's']: { increment: 1 },
      },
    })

    res.status(200).json(analytics)
    return  
  }

  res.status(405).json({ message: 'Method not allowed' })
  return
}