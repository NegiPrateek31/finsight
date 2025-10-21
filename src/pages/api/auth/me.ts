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
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: {
        select: {
          headline: true,
          bio: true,
          location: true,
          website: true,
        },
      },
    },
  })

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.status(200).json(user)
  return
}