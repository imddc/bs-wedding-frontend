<script setup lang="ts">
import { defineProps } from 'vue'
import { NAvatar, NBadge, NTag } from 'naive-ui'
import type { Conversation } from '~/components/profile/MessagesPanel.vue'

defineProps<{
  conversation: Conversation
  isSelected: boolean
}>()

// Format time relative to now
function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  // Convert to seconds, minutes, hours, days
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  // Today
  if (date.toDateString() === now.toDateString()) {
    // Within the last hour
    if (diffMins < 60) {
      if (diffMins < 1)
        return '刚刚'
      return `${diffMins}分钟前`
    }

    // Format as HH:MM
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  // Yesterday
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  }

  // This week (within 7 days)
  if (diffDays < 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return weekdays[date.getDay()]
  }

  // Older than a week
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<template>
  <div class="flex items-start hover:bg-gray-50 rounded-lg transition-colors p-2">
    <div class="relative">
      <NAvatar
        :size="48"
        :src="conversation.avatar"
        class="mr-3"
      />
      <NBadge
        v-if="conversation.unreadCount > 0"
        :value="conversation.unreadCount"
        :max="99"
        :offset="[8, 8]"
        processing
      />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start">
        <div class="font-medium truncate">
          {{ conversation.name }}
        </div>
        <div class="text-xs text-gray-500 whitespace-nowrap ml-2">
          {{ formatTime(conversation.lastMessageTime) }}
        </div>
      </div>

      <div class="mt-1 flex items-center">
        <NTag
          v-if="conversation.type === 'photography'"
          size="small"
          type="info"
          class="mr-2"
        >
          婚纱摄影
        </NTag>
        <NTag
          v-else-if="conversation.type === 'hotel'"
          size="small"
          type="success"
          class="mr-2"
        >
          婚宴酒店
        </NTag>
        <NTag
          v-else-if="conversation.type === 'host'"
          size="small"
          type="warning"
          class="mr-2"
        >
          司仪主持
        </NTag>
      </div>

      <div
        class="mt-1 text-sm text-gray-500 truncate"
        :class="{ 'font-medium text-primary': conversation.unreadCount > 0 }"
      >
        {{ conversation.lastMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
