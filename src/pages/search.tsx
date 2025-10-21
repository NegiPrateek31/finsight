import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { debounce } from 'lodash'
import Image from 'next/image'

type SearchResult = {
  users: User[]
  posts: Post[]
  total: number
  page: number
  totalPages: number
}

type User = {
  id: string
  name: string
  email: string
  image: string | null
  profile: {
    headline: string | null
    location: string | null
  } | null
}

type Post = {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  author: {
    id: string
    name: string
    image: string | null
  }
  _count: {
    likes: number
    comments: number
  }
}

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'posts' | 'users'>('all')
  const [tags, setTags] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const performSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: searchType,
        page: String(page),
        limit: '10'
      })

      if (tags.length > 0) {
        params.append('tags', tags.join(','))
      }

      if (location) {
        params.append('location', location)
      }

      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      setResults(data)

      // Update URL without triggering a new search
      router.push({
        pathname: router.pathname,
        query: { ...router.query, q: searchQuery, type: searchType, page },
      }, undefined, { shallow: true })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Debounced search function (stable via ref)
  const debouncedSearchRef = useRef(debounce(performSearch, 300))

  useEffect(() => {
    const { q, type, page: queryPage } = router.query

    if (q && typeof q === 'string') {
      setSearchQuery(q)
    }

    if (type && (type === 'all' || type === 'posts' || type === 'users')) {
      setSearchType(type)
    }

    if (queryPage && typeof queryPage === 'string') {
      setPage(Number(queryPage))
    }
  }, [router.query])

  useEffect(() => {
    const ds = debouncedSearchRef.current
    if (searchQuery) {
      ds()
    }
    return () => {
      ds.cancel()
    }
  }, [searchQuery, searchType, tags, location, page])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-4 mb-8">
        {/* Search Input */}
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'all' | 'posts' | 'users')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="posts">Posts</option>
            <option value="users">Users</option>
          </select>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <input
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
            placeholder="Tags (comma separated)"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : results ? (
        <div className="space-y-8">
          {/* Users Section */}
          {(searchType === 'all' || searchType === 'users') && results.users.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.users.map(user => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.id}`}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    {user.image && (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      {user.profile?.headline && (
                        <p className="text-gray-600 text-sm">{user.profile.headline}</p>
                      )}
                      {user.profile?.location && (
                        <p className="text-gray-500 text-sm">{user.profile.location}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {(searchType === 'all' || searchType === 'posts') && results.posts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Posts</h2>
              <div className="space-y-4">
                {results.posts.map(post => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {post.author.image && (
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <span className="font-medium">{post.author.name}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    {post.tags.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 text-gray-500 text-sm">
                      <span>{post._count.likes} likes</span>
                      <span>{post._count.comments} comments</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {results.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(page => Math.max(page - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {results.totalPages}
              </span>
              <button
                onClick={() => setPage(page => Math.min(page + 1, results.totalPages))}
                disabled={page === results.totalPages}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-8 text-gray-500">No results found</div>
      ) : null}
    </div>
  )
}