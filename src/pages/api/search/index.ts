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

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  const { 
    q = '',          // Search query
    type = 'all',    // Search type: 'all', 'posts', 'users'
    tags,            // Comma-separated tags
    location,        // User location
    page = '1',      // Page number
    limit = '10'     // Results per page
  } = req.query

  const skip = (Number(page) - 1) * Number(limit)
  const take = Number(limit)
  const searchQuery = String(q).toLowerCase()
  const searchTags = tags ? String(tags).split(',').map(tag => tag.trim()) : []
  const searchLocation = location ? String(location) : undefined

  try {
  let users: any[] = []
  let posts: any[] = []
    let total = 0

    // Search users
    if (type === 'all' || type === 'users') {
      const userWhere = {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
          {
            profile: {
              OR: [
                { headline: { contains: searchQuery, mode: 'insensitive' } },
                { bio: { contains: searchQuery, mode: 'insensitive' } },
                searchLocation ? { location: { contains: searchLocation, mode: 'insensitive' } } : {}
              ]
            }
          }
        ]
      }

      const [userResults, userCount] = await Promise.all([
        prisma.user.findMany({
          where: userWhere as any,
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: {
              select: {
                headline: true,
                location: true
              }
            }
          },
          skip: type === 'users' ? skip : 0,
          take: type === 'users' ? take : 5
        }),
  prisma.user.count({ where: userWhere as any })
      ])

      users = userResults
      if (type === 'users') total = userCount
    }

    // Search posts
    if (type === 'all' || type === 'posts') {
      const postWhere = {
        AND: [
          {
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' as const } },
              { content: { contains: searchQuery, mode: 'insensitive' as const } }
            ]
          },
          ...(searchTags.length > 0 ? [{ tags: { hasSome: searchTags } }] : [])
        ]
      }

      const [postResults, postCount] = await Promise.all([
        prisma.post.findMany({
          where: postWhere as any,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: type === 'posts' ? skip : 0,
          take: type === 'posts' ? take : 5
        }),
  prisma.post.count({ where: postWhere as any })
      ])

      posts = postResults
      if (type === 'posts') total = postCount
    }

    // Calculate total for combined results
    if (type === 'all') {
      total = (await Promise.all([
        prisma.user.count({
          where: {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { email: { contains: searchQuery, mode: 'insensitive' } }
            ]
          }
        }),
        prisma.post.count({
          where: {
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' } },
              { content: { contains: searchQuery, mode: 'insensitive' } }
            ]
          }
        })
      ])).reduce((a: number, b: number) => a + b, 0)
    }

    res.status(200).json({
      users,
      posts,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    })
    return
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ message: 'Error performing search' })
    return
  }
}