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

  try {
    const { file } = req.body
    if (!file) {
      res.status(400).json({ error: 'No file provided' })
      return
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: 'finsight',
      resource_type: 'auto',
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