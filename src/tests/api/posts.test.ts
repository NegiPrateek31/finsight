import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMocks } from 'node-mocks-http'
import postsHandler from '../../pages/api/posts'
// prisma is provided by mock helper
import { setupPrismaMock } from '../utils/prismaMock'
let mockedPrisma: any
/* mockSession intentionally unused */

vi.mock('../../lib/prisma')
vi.mock('next-auth/react')

describe('/api/posts', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockedPrisma = setupPrismaMock()
  })

  it('returns posts list for GET request', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    const mockPosts = [
      { id: '1', title: 'Test Post', content: 'Content' },
      { id: '2', title: 'Another Post', content: 'More content' }
    ]

    // Ensure mock functions exist
    mockedPrisma.post.findMany.mockResolvedValue(mockPosts)

    await postsHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(mockPosts)
  })

  it('creates post for authenticated POST request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: 'New Post',
        content: 'Post content',
        authorId: 'user-1'
      }
    })

    const mockPost = {
      id: 'new-post-1',
      title: 'New Post',
      content: 'Post content',
      authorId: 'user-1'
    }

    // Ensure create resolved value
  mockedPrisma.post.create.mockResolvedValue(mockPost)

    await postsHandler(req, res)

    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toEqual(mockPost)
  })
})