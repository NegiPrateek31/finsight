import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NotificationsPanel from './NotificationsPanel'
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Finsight</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/feed" className="px-3 py-2 text-sm font-medium text-gray-900">
                Feed
              </Link>
              {session && (
                <>
                  <Link href="/posts/create" className="px-3 py-2 text-sm font-medium text-gray-900">
                    Create Post
                  </Link>
                  <Link 
                    href={`/profile/${session.user?.id}`}
                    className="px-3 py-2 text-sm font-medium text-gray-900"
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, users..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {session && (
              <>
                <NotificationsPanel />
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ''}
                    className="rounded-full"
                    width={32}
                    height={32}
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  Sign Out
                </button>
              </>
            )}
            {!session && (
              <Link 
                href="/auth/signin" 
                className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}