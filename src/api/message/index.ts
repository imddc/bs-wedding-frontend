import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'
import type {
  ChatMessage,
  ChatMessageCreateParams,
  ChatMessagePage,
  ChatMessageQueryParams,
} from './type'

/**
 * Send a new message
 */
export async function sendMessage(data: ChatMessageCreateParams) {
  return request.post<DataType<number>>({
    url: '/messages',
    data,
  })
}

/**
 * Get message by ID
 */
export async function getMessageById(id: number) {
  return request.get<DataType<ChatMessage>>({
    url: `/messages/${id}`,
  })
}

/**
 * Delete a message
 */
export async function deleteMessage(id: number) {
  return request.delete<DataType<boolean>>({
    url: `/messages/${id}`,
  })
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(id: number) {
  return request.put<DataType<boolean>>({
    url: `/messages/${id}/read`,
  })
}

/**
 * Mark all messages as read for a receiver
 */
export async function markAllMessagesAsRead(receiverId: number) {
  return request.put<DataType<number>>({
    url: '/messages/read/all',
    params: { receiverId },
  })
}

/**
 * Get chat history between two users
 */
export async function getChatHistory(userId1: number, userId2: number, current = 1, size = 20) {
  return request.get<DataType<ChatMessagePage>>({
    url: '/messages/history',
    params: { userId1, userId2, current, size },
  })
}

/**
 * Get chat list for a user
 */
export async function getUserChatList(userId: number) {
  return request.get<DataType<ChatMessage[]>>({
    url: '/messages/list',
    params: { userId },
  })
}

/**
 * Get unread message count for a user
 */
export async function getUnreadCount(userId: number) {
  return request.get<DataType<number>>({
    url: '/messages/unread/count',
    params: { userId },
  })
}

/**
 * Paginate messages with query parameters
 */
export async function pageMessages(params: ChatMessageQueryParams) {
  return request.get<DataType<ChatMessagePage>>({
    url: '/messages/page',
    params,
  })
}
