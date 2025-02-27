<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { NButton, NCard, NSpace, NTag } from 'naive-ui'
import type { WeddingService } from '~/components/profile/WeddingPlanPanel.vue'

defineProps<{
  service: WeddingService
}>()

defineEmits<{
  view: [service: WeddingService]
  book: [service: WeddingService]
}>()

// Format price
function formatPrice(price: number): string {
  return price.toLocaleString('zh-CN')
}

// Get service type text
function getTypeText(type: string): string {
  switch (type) {
    case 'photography': return '婚纱摄影'
    case 'hotel': return '婚宴酒店'
    case 'host': return '司仪主持'
    default: return '其他服务'
  }
}

// Get status text
function getStatusText(status: string): string {
  switch (status) {
    case 'pending': return '待预订'
    case 'booked': return '已预订'
    case 'completed': return '已完成'
    default: return '未知状态'
  }
}

// Get type tag type
function getTypeTagType(type: string): string {
  switch (type) {
    case 'photography': return 'info'
    case 'hotel': return 'success'
    case 'host': return 'warning'
    default: return 'default'
  }
}
</script>

<template>
  <NCard hoverable class="service-card">
    <div class="relative">
      <div class="h-40 overflow-hidden rounded-lg mb-3">
        <img
          :src="service.image"
          :alt="service.name"
          class="w-full h-full object-cover"
        >
      </div>

      <div
        v-if="service.status !== 'pending'"
        class="absolute top-2 right-2"
      >
        <NTag
          :type="service.status === 'completed' ? 'success' : 'info'"
          size="small"
        >
          {{ getStatusText(service.status) }}
        </NTag>
      </div>
    </div>

    <div>
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-medium">
          {{ service.name }}
        </h3>
        <NTag :type="getTypeTagType(service.type)">
          {{ getTypeText(service.type) }}
        </NTag>
      </div>

      <p class="text-gray-500 text-sm mb-3 line-clamp-2">
        {{ service.description }}
      </p>

      <div class="flex justify-between items-center">
        <div class="text-primary text-lg font-bold">
          ¥{{ formatPrice(service.price) }}
        </div>

        <div>
          <NSpace>
            <NButton
              secondary
              size="small"
              @click="$emit('view', service)"
            >
              查看详情
            </NButton>

            <NButton
              v-if="service.status === 'pending'"
              type="primary"
              size="small"
              @click="$emit('book', service)"
            >
              立即预订
            </NButton>
          </NSpace>
        </div>
      </div>
    </div>
  </NCard>
</template>

<style scoped>
.service-card {
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
