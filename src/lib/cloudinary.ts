import { v2 as cloudinary } from 'cloudinary'

const CLOUDINARY_URL = process.env.CLOUDINARY_URL || ''

if (CLOUDINARY_URL) {
  cloudinary.config({ secure: true })
}

export async function uploadToCloudinary(path: string) {
  if (!CLOUDINARY_URL) throw new Error('CLOUDINARY_URL not configured')
  const res = await cloudinary.uploader.upload(path, { resource_type: 'auto' })
  return res
}