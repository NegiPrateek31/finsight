/* eslint-disable no-unused-vars */
import { NextApiResponse } from 'next'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public error?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, error?: any) {
    super(400, message, error)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Not authenticated') {
    super(401, message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Not authorized') {
    super(403, message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(404, message)
    this.name = 'NotFoundError'
  }
}

export function handleApiError(error: unknown, res: NextApiResponse) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    })
    return
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    switch ((error as any).code) {
      case 'P2002': // Unique constraint violation
        res.status(400).json({
          message: 'This record already exists',
          error: (error as any).meta,
        })
        return
      case 'P2025': // Record not found
        res.status(404).json({
          message: 'Record not found',
          error: (error as any).meta,
        })
        return
      default:
        break
    }
  }

  // Default to 500 internal server error
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error : undefined,
  })
  return
}

export async function withErrorHandler(
  handler: () => Promise<any>,
  res: NextApiResponse
) {
  try {
    return await handler()
  } catch (error) {
    handleApiError(error, res)
  }
}