import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface Notification {
  id: string
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'POST_REPORT' | 'POST_REMOVED'
  read: boolean
  createdAt: string
  creator: {
    id: string
    name: string
    image: string | null
  }
  postId?: string
  commentId?: string
}

export function useNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!session?.user) return

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (!res.ok) throw new Error('Failed to fetch notifications')
        const data = await res.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Set up SSE connection for real-time notifications
    const eventSource = new EventSource('/api/notifications/stream')

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'notification') {
        setNotifications(prev => [data.data, ...prev])
        setUnreadCount(prev => prev + 1)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [session])

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds }),
      })

      if (!res.ok) throw new Error('Failed to mark notifications as read')

      setNotifications(prev =>
        prev.map(notification =>
          notificationIds.includes(notification.id)
            ? { ...notification, read: true }
            : notification
        )
      )

      setUnreadCount(prev => prev - notificationIds.length)
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
  }
}