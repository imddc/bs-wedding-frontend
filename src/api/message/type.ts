export interface ChatMessage {
  id: number
  senderId: number
  receiverId: number
  content: string
  isRead: boolean
  createTime: string
}

export interface ChatMessageCreateParams {
  senderId: number
  receiverId: number
  content: string
}

export interface ChatMessageUpdateParams {
  id: number
  isRead?: boolean
}

export interface ChatMessageQueryParams {
  senderId?: number
  receiverId?: number
  content?: string
  current?: number
  size?: number
}

export interface ChatMessagePage {
  records: ChatMessage[]
  total: number
  size: number
  current: number
  pages: number
}
