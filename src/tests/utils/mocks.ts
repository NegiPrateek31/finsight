import { vi } from 'vitest'
import { Session } from 'next-auth'

export function mockSession(session: Partial<Session> = {}) {
  const defaultSession: Session = {
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      image: null,
      role: 'USER',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }

  return {
    ...defaultSession,
    ...session
  }
}

export const mockNextAuth = vi.mock('next-auth/react', () => {
  const mod = vi.importActual('next-auth/react')
  return {
    ...mod,
    useSession: vi.fn(() => ({
      data: mockSession(),
      status: 'authenticated'
    })),
    signIn: vi.fn(),
    signOut: vi.fn()
  }
})

export const mockPrisma = vi.mock('../lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn()
    },
    post: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn()
    }
  }
}))