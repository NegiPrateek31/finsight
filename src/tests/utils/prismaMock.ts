import { vi } from 'vitest'
import prisma from '../../lib/prisma'

// Ensure the prisma client is mocked once for tests that need it
export function setupPrismaMock() {
  const mockedPrisma = vi.mocked(prisma as any, true)

  // Default mock implementations for common models
  mockedPrisma.post = {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } as any

  mockedPrisma.user = {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  } as any

  return mockedPrisma
}
