import { Post, User } from '@prisma/client'

export interface PostResponse extends Post {
  author: Pick<User, 'id' | 'name' | 'image'>
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface UploadResponse {
  url: string
  publicId: string
}