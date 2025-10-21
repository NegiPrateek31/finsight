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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  if (req.method === 'GET') {
  const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    res.status(200).json(notifications)
    return
  }

  if (req.method === 'PUT') {
    const { notificationIds } = req.body

    if (!Array.isArray(notificationIds)) {
      res.status(400).json({ message: 'Invalid notification IDs' })
      return
    }

  await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: user.id,
      },
      data: {
    read: true,
      },
    })

    res.status(200).json({ message: 'Notifications marked as read' })
    return    
  }

  res.status(405).json({ message: 'Method not allowed' })
  return    
}