// negiprateek31/finsight/finsight-1382f5b01244365c9a92f06365cf1e52dc019117/src/pages/api/upload.ts
import { v2 as cloudinary } from 'cloudinary'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB (matches bodyParser limit)
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']

// Helper to check if a base64 string exceeds the limit (approximate, since base64 is ~33% larger)
function checkFileSize(base64: string, maxSize: number): boolean {
  const base64Content = base64.split(';base64,')[1]
  if (!base64Content) return false
  // Estimate size: Base64 length * 0.75 (3 bytes encoded to 4 chars)
  const fileSizeEstimate = base64Content.length * 0.75
  return fileSizeEstimate <= maxSize
}

// Helper to extract mime type from data URI
function extractMimeType(base64: string): string | null {
  const match = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)
  return match ? match[1] : null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const session = await getSession({ req })

  if (!session?.user?.email) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  // CRITICAL FIX: Check Cloudinary Configuration
  if (!process.env.CLOUDINARY_URL) {
    console.error('CLOUDINARY_URL environment variable is not configured.')
    res.status(500).json({ error: 'File upload service not configured. Check server logs.' })
    return
  }

  try {
    const { file } = req.body
    if (!file || typeof file !== 'string') {
      res.status(400).json({ error: 'No file provided or invalid format.' })
      return
    }
    
    // CRITICAL FIX: Server-side File Validation (Size and Type)
    const mimeType = extractMimeType(file)
    
    if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
      res.status(400).json({ error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` })
      return
    }

    if (!checkFileSize(file, MAX_FILE_SIZE_BYTES)) {
      res.status(400).json({ error: `File size exceeds the limit of ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.` })
      return
    }

    // Since validation passed, proceed with upload
    const result = await cloudinary.uploader.upload(file, {
      folder: 'finsight',
      resource_type: 'auto', // Cloudinary handles resource type based on file type
    })

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
    return
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Error uploading file' })
    return
  }
}