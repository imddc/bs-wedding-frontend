<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { CheckCheckIcon, CheckCircleIcon, CheckIcon } from 'lucide-vue-next'
import { NAvatar, NButtonGroup, NCard, NDivider, NForm, NFormItem, NImage, NInput, NModal, NPagination, NRate, NSelect, NSpace, NTab, NTabs, NTag, NTooltip, NUpload, useLoadingBar, useMessage } from 'naive-ui'
import type { Message } from '~/components/profile/MessagesPanel.vue'

const props = defineProps<{
  message: Message & {
    senderAvatar?: string
    imageWidth?: number
    imageHeight?: number
  }
  isSelf: boolean
}>()

// Image preview
const showImagePreview = ref(false)
function previewImage() {
  if (props.message.contentType === 'image') {
    showImagePreview.value = true
  }
}

// Format message time
function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// Get status text
function getStatusText(status: string): string {
  switch (status) {
    case 'sent': return '已发送'
    case 'delivered': return '已送达'
    case 'read': return '已读'
    default: return ''
  }
}

// Calculate image size for display
function calculateImageSize(width?: number, height?: number) {
  // Default size if dimensions aren't provided
  if (!width || !height) {
    return { width: 200, height: 150 }
  }

  const maxWidth = 240
  const maxHeight = 180
  const aspectRatio = width / height

  if (width > height) {
    // Landscape image
    const calculatedWidth = Math.min(width, maxWidth)
    return {
      width: calculatedWidth,
      height: Math.round(calculatedWidth / aspectRatio),
    }
  } else {
    // Portrait or square image
    const calculatedHeight = Math.min(height, maxHeight)
    return {
      width: Math.round(calculatedHeight * aspectRatio),
      height: calculatedHeight,
    }
  }
}
</script>

<template>
  <div
    class="message-container mb-4"
    :class="{ 'flex-row-reverse': isSelf }"
  >
    <NAvatar
      :size="36"
      :src="message.senderAvatar"
      class="flex-shrink-0"
      :class="{ 'ml-3': isSelf, 'mr-3': !isSelf }"
    />

    <div class="max-w-[70%]">
      <!-- Message content -->
      <div
        class="message-bubble p-3 rounded-lg"
        :class="[
          isSelf ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none border border-gray-200',
        ]"
      >
        <!-- Text message -->
        <div v-if="message.contentType === 'text'" class="whitespace-pre-wrap break-words">
          {{ message.content }}
        </div>

        <!-- Image message -->
        <div v-else-if="message.contentType === 'image'" class="max-w-xs">
          <NImage
            :src="message.content"
            preview-disabled
            object-fit="cover"
            class="rounded cursor-pointer"
            :width="calculateImageSize(message.imageWidth, message.imageHeight).width"
            :height="calculateImageSize(message.imageWidth, message.imageHeight).height"
            @click="previewImage"
          />
        </div>
      </div>

      <!-- Message time and status -->
      <div
        class="text-xs text-gray-400 mt-1"
        :class="{ 'text-right': isSelf, 'text-left': !isSelf }"
      >
        {{ formatMessageTime(message.createdTime) }}
        <span v-if="isSelf" class="ml-1">
          <NTooltip placement="bottom">
            <template #trigger>
              <span>
                <CheckIcon v-if="message.status === 'sent'" size="12" />
                <CheckCheckIcon v-else-if="message.status === 'delivered'" size="12" />
                <CheckCircleIcon v-else-if="message.status === 'read'" size="12" class="text-primary" />
              </span>
            </template>
            {{ getStatusText(message.status) }}
          </NTooltip>
        </span>
      </div>
    </div>

    <!-- Image preview modal -->
    <NModal
      v-model:show="showImagePreview"
      preset="card"
      style="width: auto; max-width: 90vw; max-height: 90vh;"
      :mask-closable="true"
      :show-icon="false"
    >
      <NImage
        v-if="message.contentType === 'image'"
        :src="message.content"
        object-fit="contain"
        :width="null"
        :height="null"
        style="max-width: 100%; max-height: 80vh;"
      />
    </NModal>
  </div>
</template>

<style scoped>
.message-container {
  display: flex;
  align-items: flex-start;
}

.message-bubble {
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
