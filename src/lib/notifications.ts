/* eslint-disable no-unused-vars */
import { NotificationType } from '@prisma/client'
import prisma from './prisma'

// In-memory store for SSE clients
interface NotificationClient {
  userId: string
  send: (data: string) => void
}

const clients = new Map<string, NotificationClient[]>()

export async function createNotification({
  userId,
  creatorId,
  type,
  postId,
  commentId,
}: {
  userId: string
  creatorId: string
  type: NotificationType
  postId?: string
  commentId?: string
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        creatorId,
        type,
        postId,
        commentId,
      },
      include: {
        creator: { select: { name: true } },
      },
    })

    const userClients = clients.get(userId)
    if (userClients?.length) {
      const notificationData = JSON.stringify({
        type: 'notification',
        data: notification,
      })
      userClients.forEach((client) => {
        try {
          client.send(notificationData)
        } catch (error) {
          console.error('Error sending notification:', error)
        }
      })
    }

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

export function addNotificationClient(userId: string, client: NotificationClient) {
  const userClients = clients.get(userId) || []
  clients.set(userId, [...userClients, client])
}

export function removeNotificationClient(userId: string, clientToRemove: NotificationClient) {
  const userClients = clients.get(userId) || []
  clients.set(
    userId,
    userClients.filter((client) => client !== clientToRemove)
  )
}

export function getNotificationMessage(notification: {
  type: NotificationType
  creator: { name: string | null }
}) {
  const actor = notification.creator.name || 'Someone'

  switch (notification.type) {
    case 'LIKE':
      return `${actor} liked your post`
    case 'COMMENT':
      return `${actor} commented on your post`
    case 'FOLLOW':
      return `${actor} started following you`
    case 'MENTION':
      return `${actor} mentioned you in a post`
    case 'POST_REPORT':
      return 'Your post has been reported'
    case 'POST_REMOVED':
      return 'Your post has been removed by moderators'
    default:
      return 'You have a new notification'
  }
}