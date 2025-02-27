<script setup lang="ts">
import { defineProps, nextTick, onMounted, reactive, ref, watchEffect } from 'vue'
import { NButton, NButtonGroup, NCard, NDivider, NForm, NFormItem, NInput, NModal, NPagination, NRate, NSelect, NSpace, NTab, NTabs, NTag, NUpload, useLoadingBar, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import {
  ExternalLink,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MessageSquare,
  Smile,
} from 'lucide-vue-next'
import { MessageService } from '~/services/messageService'
import { FavoriteService } from '~/services/favoriteService'

// Import components
import ConversationItem from '~/components/message/ConversationItem.vue'
import MessageBubble from '~/components/message/MessageBubble.vue'

// Interfaces
export interface Conversation {
  id: number
  vendorId: number
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  type: 'photography' | 'hotel' | 'host'
  isFavorite: boolean
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  receiverId: number
  content: string
  contentType: 'text' | 'image'
  createdTime: string
  status: 'sent' | 'delivered' | 'read'
}

const props = defineProps<{
  messages: Message[]
}>()

// State
const message = useMessage()
const router = useRouter()
const conversations = ref<Conversation[]>([])
const selectedConversation = ref<Conversation | null>(null)
const messages = ref<Message[]>([])
const messageInput = ref('')
const loading = ref(false)
const currentUserId = ref(0) // This should be set to the current user's ID
const messageContainer = ref<HTMLElement | null>(null)
const showEmojiPicker = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Common emojis
const commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '🙏', '💐', '🥂', '💍', '👰', '🤵', '💒', '🎊', '✨', '🌹', '🌟']

// Load conversations
async function loadConversations() {
  try {
    const { data } = await MessageService.getConversations()

    if (data.code === 200) {
      conversations.value = data.data

      // If there are unread messages, select the first conversation with unread messages
      const unreadConversation = conversations.value.find(c => c.unreadCount > 0)
      if (unreadConversation) {
        selectConversation(unreadConversation)
      } else if (conversations.value.length > 0) {
        // Otherwise select the first conversation
        selectConversation(conversations.value[0])
      }
    } else {
      message.error(data.message || '获取对话列表失败')
    }
  } catch (error) {
    message.error('获取对话列表失败，请检查网络连接')
    console.error('Error loading conversations:', error)
  }
}

// Select conversation
async function selectConversation(conversation: Conversation) {
  selectedConversation.value = conversation
  loading.value = true

  try {
    const { data } = await MessageService.getMessages(conversation.id)

    if (data.code === 200) {
      messages.value = data.data

      // Mark messages as read
      if (conversation.unreadCount > 0) {
        await MessageService.markAsRead(conversation.id)
        conversation.unreadCount = 0
      }

      // Scroll to bottom after messages load
      await nextTick()
      scrollToBottom()
    } else {
      message.error(data.message || '获取消息记录失败')
    }
  } catch (error) {
    message.error('获取消息记录失败，请检查网络连接')
    console.error('Error loading messages:', error)
  } finally {
    loading.value = false
  }
}

// Scroll to bottom of message container
function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

// Send message
async function sendMessage() {
  if (!messageInput.value.trim() || !selectedConversation.value)
    return

  const content = messageInput.value
  messageInput.value = ''

  const tempId = Date.now()
  const tempMessage: Message = {
    id: tempId,
    conversationId: selectedConversation.value.id,
    senderId: currentUserId.value,
    receiverId: selectedConversation.value.vendorId,
    content,
    contentType: 'text',
    createdTime: new Date().toISOString(),
    status: 'sent',
  }

  // Add message optimistically
  messages.value.push(tempMessage)

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  try {
    const { data } = await MessageService.sendMessage({
      conversationId: selectedConversation.value.id,
      receiverId: selectedConversation.value.vendorId,
      content,
      contentType: 'text',
    })

    if (data.code === 200) {
      // Replace temp message with actual message
      const index = messages.value.findIndex(m => m.id === tempId)
      if (index !== -1) {
        messages.value[index] = data.data
      }

      // Update last message in conversation list
      selectedConversation.value.lastMessage = content
      selectedConversation.value.lastMessageTime = new Date().toISOString()
    } else {
      message.error(data.message || '发送消息失败')

      // Remove temp message
      const index = messages.value.findIndex(m => m.id === tempId)
      if (index !== -1) {
        messages.value.splice(index, 1)
      }
    }
  } catch (error) {
    message.error('发送消息失败，请检查网络连接')
    console.error('Error sending message:', error)

    // Remove temp message
    const index = messages.value.findIndex(m => m.id === tempId)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }
}

// Show date divider
function showDateDivider(message: Message, index: number): boolean {
  if (index === 0)
    return true

  const prevMessage = messages.value[index - 1]
  const prevDate = new Date(prevMessage.createdTime).setHours(0, 0, 0, 0)
  const currentDate = new Date(message.createdTime).setHours(0, 0, 0, 0)

  return prevDate !== currentDate
}

// Format date for divider
function formatDividerDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
    return '今天'
  } else if (date.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)) {
    return '昨天'
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }
}

// Toggle favorite
async function toggleFavorite(conversation: Conversation) {
  if (!conversation)
    return

  try {
    if (conversation.isFavorite) {
      // Get favorite ID first
      const checkResponse = await FavoriteService.checkFavoriteStatus(conversation.type, conversation.vendorId)

      if (checkResponse.data.code === 200 && checkResponse.data.data.favoriteId) {
        const favoriteId = checkResponse.data.data.favoriteId
        const { data } = await FavoriteService.removeFavorite(favoriteId)

        if (data.code === 200) {
          conversation.isFavorite = false
          message.success('已取消收藏')
        } else {
          message.error(data.message || '取消收藏失败')
        }
      }
    } else {
      const { data } = await FavoriteService.addFavorite(conversation.type, conversation.vendorId)

      if (data.code === 200) {
        conversation.isFavorite = true
        message.success('已添加收藏')
      } else {
        message.error(data.message || '添加收藏失败')
      }
    }
  } catch (error) {
    message.error('操作失败，请检查网络连接')
    console.error('Error toggling favorite:', error)
  }
}

// View vendor detail
function viewVendorDetail(conversation: Conversation) {
  if (!conversation)
    return

  let path = ''
  switch (conversation.type) {
    case 'photography':
      path = `/photography/${conversation.vendorId}`
      break
    case 'hotel':
      path = `/hotel/${conversation.vendorId}`
      break
    case 'host':
      path = `/host/${conversation.vendorId}`
      break
  }

  if (path) {
    router.push(path)
  }
}

// Toggle emoji picker
function toggleEmojiPicker() {
  showEmojiPicker.value = !showEmojiPicker.value
}

// Insert emoji
function insertEmoji(emoji: string) {
  messageInput.value += emoji
  showEmojiPicker.value = false
}

// Handle image upload
function handleImageUpload() {
  fileInput.value?.click()
}

// Upload image
async function uploadImage(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0] || !selectedConversation.value)
    return

  const file = target.files[0]

  // Generate a temporary ID
  const tempId = Date.now()

  // Create a temporary message
  const tempMessage: Message = {
    id: tempId,
    conversationId: selectedConversation.value.id,
    senderId: currentUserId.value,
    receiverId: selectedConversation.value.vendorId,
    content: URL.createObjectURL(file), // Create a local URL for preview
    contentType: 'image',
    createdTime: new Date().toISOString(),
    status: 'sent',
  }

  // Add message optimistically
  messages.value.push(tempMessage)

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  try {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('conversationId', selectedConversation.value.id.toString())
    formData.append('receiverId', selectedConversation.value.vendorId.toString())

    const { data } = await MessageService.sendImageMessage(formData)

    if (data.code === 200) {
      // Replace temp message with actual message
      const index = messages.value.findIndex(m => m.id === tempId)
      if (index !== -1) {
        messages.value[index] = data.data
      }

      // Update last message in conversation list
      selectedConversation.value.lastMessage = '[图片消息]'
      selectedConversation.value.lastMessageTime = new Date().toISOString()
    } else {
      message.error(data.message || '发送图片失败')

      // Remove temp message
      const index = messages.value.findIndex(m => m.id === tempId)
      if (index !== -1) {
        messages.value.splice(index, 1)
      }
    }
  } catch (error) {
    message.error('发送图片失败，请检查网络连接')
    console.error('Error sending image:', error)

    // Remove temp message
    const index = messages.value.findIndex(m => m.id === tempId)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  } finally {
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// Load user ID
async function loadCurrentUserId() {
  try {
    const { data } = await MessageService.getCurrentUser()

    if (data.code === 200) {
      currentUserId.value = data.data.id
    }
  } catch (error) {
    console.error('Error loading current user:', error)
  }
}

// Initialize
onMounted(async () => {
  await loadCurrentUserId()
  await loadConversations()
})

// Close emoji picker when clicking outside
function closeEmojiPicker(event: MouseEvent) {
  if (showEmojiPicker.value) {
    showEmojiPicker.value = false
  }
}

// Listen for click events on document
onMounted(() => {
  document.addEventListener('click', closeEmojiPicker)
})

// Watch for new messages from props
watchEffect(() => {
  if (props.messages && props.messages.length > 0) {
    // Check if any new messages belong to current conversation
    const newMessages = props.messages.filter(
      msg => selectedConversation.value && msg.conversationId === selectedConversation.value.id
        && !messages.value.some(m => m.id === msg.id),
    )

    if (newMessages.length > 0) {
      // Add new messages to the chat
      messages.value.push(...newMessages)

      // Scroll to bottom
      nextTick(() => {
        scrollToBottom()
      })
    }
  }
})
</script>

<template>
  <div class="h-full">
    <NCard title="消息记录" class="message-card mb-4">
      <div class="flex h-[600px]">
        <!-- Conversation List -->
        <div class="w-1/3 border-r border-gray-200 h-full overflow-y-auto">
          <div
            v-for="conversation in conversations"
            :key="conversation.id"
            class="p-4 border-b border-gray-100 cursor-pointer"
            :class="{ 'bg-gray-100': selectedConversation?.id === conversation.id }"
            @click="selectConversation(conversation)"
          >
            <ConversationItem
              :conversation="conversation"
              :is-selected="selectedConversation?.id === conversation.id"
            />
          </div>

          <div v-if="conversations.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle size="48" class="mb-2 text-gray-300" />
            <p>暂无消息</p>
          </div>
        </div>

        <!-- Message Content -->
        <div class="w-2/3 flex flex-col h-full">
          <div v-if="selectedConversation" class="flex flex-col h-full">
            <!-- Conversation Header -->
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
              <div class="flex items-center">
                <n-avatar
                  :size="40"
                  :src="selectedConversation.avatar"
                  class="mr-3"
                />
                <div>
                  <div class="font-medium">
                    {{ selectedConversation.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    <NTag v-if="selectedConversation.type === 'photography'" size="small" type="info">
                      婚纱摄影
                    </NTag>
                    <NTag v-else-if="selectedConversation.type === 'hotel'" size="small" type="success">
                      婚宴酒店
                    </NTag>
                    <NTag v-else-if="selectedConversation.type === 'host'" size="small" type="warning">
                      司仪主持
                    </NTag>
                  </div>
                </div>
              </div>

              <div class="flex">
                <n-tooltip trigger="hover" placement="bottom">
                  <template #trigger>
                    <NButton circle quaternary @click="viewVendorDetail(selectedConversation)">
                      <ExternalLink size="18" />
                    </NButton>
                  </template>
                  查看商家详情
                </n-tooltip>

                <n-tooltip trigger="hover" placement="bottom">
                  <template #trigger>
                    <NButton circle quaternary @click="toggleFavorite(selectedConversation)">
                      <Heart size="18" :fill="selectedConversation.isFavorite ? '#f43f5e' : 'transparent'" />
                    </NButton>
                  </template>
                  {{ selectedConversation.isFavorite ? '取消收藏' : '收藏商家' }}
                </n-tooltip>
              </div>
            </div>

            <!-- Message List -->
            <div
              ref="messageContainer"
              class="flex-1 p-4 overflow-y-auto bg-gray-50"
            >
              <div v-if="loading" class="flex justify-center py-4">
                <n-spin size="medium" />
              </div>

              <template v-else>
                <div v-for="(message, index) in messages" :key="message.id">
                  <!-- Date Divider -->
                  <div
                    v-if="showDateDivider(message, index)"
                    class="text-center my-4"
                  >
                    <div class="inline-block px-4 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                      {{ formatDividerDate(message.createdTime) }}
                    </div>
                  </div>

                  <!-- Message Bubble -->
                  <MessageBubble
                    :message="message"
                    :is-self="message.senderId === currentUserId"
                  />
                </div>

                <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-48 text-gray-500">
                  <p>暂无消息记录，发送第一条消息开始交流吧</p>
                </div>
              </template>
            </div>

            <!-- Message Input -->
            <div class="p-4 border-t border-gray-200">
              <div class="flex mb-2">
                <NButtonGroup size="small">
                  <NButton quaternary @click="toggleEmojiPicker">
                    <Smile size="18" />
                  </NButton>
                  <NButton quaternary @click="handleImageUpload">
                    <Image size="18" />
                  </NButton>
                </NButtonGroup>
              </div>

              <div class="relative">
                <NInput
                  v-model:value="messageInput"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                  placeholder="输入消息..."
                  @keydown.enter.prevent="sendMessage"
                />

                <div class="absolute right-2 bottom-2">
                  <NButton
                    type="primary"
                    :disabled="!messageInput.trim()"
                    @click="sendMessage"
                  >
                    发送
                  </NButton>
                </div>

                <!-- Emoji Picker (placeholder) -->
                <div v-if="showEmojiPicker" class="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 z-10">
                  <div class="grid grid-cols-8 gap-1">
                    <div
                      v-for="emoji in commonEmojis"
                      :key="emoji"
                      class="cursor-pointer text-center p-1 hover:bg-gray-100 rounded"
                      @click="insertEmoji(emoji)"
                    >
                      {{ emoji }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Hidden file input -->
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="uploadImage"
              >
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare size="64" class="mb-4 text-gray-300" />
            <p>选择一个对话开始聊天</p>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.message-card :deep(.n-card__content) {
  padding: 0;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
