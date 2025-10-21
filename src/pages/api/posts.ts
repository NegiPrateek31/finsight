import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({ take: 50, orderBy: { createdAt: 'desc' } })
    res.status(200).json(posts)
    return
  }
  if (req.method === 'POST') {
    const { title, content, authorId } = req.body
    const post = await prisma.post.create({ data: { title, content, authorId } })
    res.status(201).json(post)
    return
  }
  res.status(405).end()
}
