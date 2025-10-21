// negiprateek31/finsight/finsight-1382f5b01244365c9a92f06365cf1e52dc019117/src/pages/api/notifications/stream.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from '@/lib/auth'
import { addNotificationClient, removeNotificationClient } from '@/lib/notifications'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
  return 
}

  // Set headers for SSE
  res.setHeader('Content-Type','text/event-stream')
  res.setHeader('Cache-Control','no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // Disable Nginx buffering

  // Send initial message
  res.write('data: {"type":"connected"}\n\n')

  // This user.id is now securely populated by withAuth from the DB
  const userId = (req as any).user.id 
  const client = {
    userId,
    send: (data: string) => {
      res.write(`data: ${data}\n\n`)
    },
  }

  // Add client to notification subscribers
  addNotificationClient(userId, client)

  // Remove client when connection closes
  req.on('close', () => {
    removeNotificationClient(userId, client)
    res.end()
  })

  // Keep connection alive by sending a ping every 30 seconds
  const pingInterval = setInterval(() => {
    res.write('data: {"type":"ping"}\n\n')
  }, 30000)

  // Clean up interval on connection close
  req.on('close', () => {
    clearInterval(pingInterval)
  })
}

export default withAuth(handler)

// Disable body parsing, as it's not needed for SSE
export const config = {
  api: {
    bodyParser: false,
  },
}