import axios from 'axios'
import type { Conversation, Message } from '~/components/profile/MessagesPanel.vue'

// Response interface
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// Configure axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

// Current user interface
interface CurrentUser {
  id: number
  username: string
  avatar: string
}

// Message send request
interface MessageSendRequest {
  conversationId: number
  receiverId: number
  content: string
  contentType: 'text' | 'image'
}

export const MessageService = {
  // Get current user information
  getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
    return apiClient.get('/user/current')
  },

  // Get all conversations
  getConversations(): Promise<ApiResponse<Conversation[]>> {
    return apiClient.get('/messages/conversations')
  },

  // Get messages for a conversation
  getMessages(conversationId: number): Promise<ApiResponse<Message[]>> {
    return apiClient.get(`/messages/conversations/${conversationId}`)
  },

  // Send text message
  sendMessage(message: MessageSendRequest): Promise<ApiResponse<Message>> {
    return apiClient.post('/messages/send', message)
  },

  // Send image message
  sendImageMessage(formData: FormData): Promise<ApiResponse<Message>> {
    return apiClient.post('/messages/send-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Mark conversation as read
  markAsRead(conversationId: number): Promise<ApiResponse<any>> {
    return apiClient.put(`/messages/conversations/${conversationId}/read`)
  },

  // Create a new conversation
  createConversation(vendorId: number, type: string): Promise<ApiResponse<{ conversationId: number }>> {
    return apiClient.post('/messages/conversations', {
      vendorId,
      type,
    })
  },

  // Search messages
  searchMessages(query: string): Promise<ApiResponse<Message[]>> {
    return apiClient.get(`/messages/search?query=${encodeURIComponent(query)}`)
  },

  // Delete conversation
  deleteConversation(conversationId: number): Promise<ApiResponse<any>> {
    return apiClient.delete(`/messages/conversations/${conversationId}`)
  },

  // Get unread count
  getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return apiClient.get('/messages/unread-count')
  },
}
