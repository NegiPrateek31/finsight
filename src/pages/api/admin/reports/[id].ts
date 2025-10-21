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

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, id: true }
  })

  if (user?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Not authorized' })
    return
  }

  if (req.method === 'GET') {
    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.status(200).json(reports)
    return
  }

  if (req.method === 'PUT') {
    const reportId = req.query.id as string
    const { action } = req.body

    if (!reportId || !action) {
      res.status(400).json({ message: 'Missing required fields' })
      return
    }

    if (!['resolve', 'reject'].includes(action)) {
      res.status(400).json({ message: 'Invalid action' })
      return
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {},
    })

    // If resolved, create notification for post author
    if (action === 'resolve') {
      const post = await prisma.post.findUnique({
        where: { id: report.postId! },
        select: { authorId: true },
      })

      if (post) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            creatorId: user.id,
            type: 'POST_REMOVED',
            postId: report.postId!,
          },
        })
      }
    }

    res.status(200).json(report)
    return
  }

  res.status(405).json({ message: 'Method not allowed' })
  return
}