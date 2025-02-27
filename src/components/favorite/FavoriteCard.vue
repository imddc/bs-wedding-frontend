<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { Heart, MessageCircle } from 'lucide-vue-next'
import { NButton, NCard, NRate, NTag } from 'naive-ui'
import type { FavoriteItem } from '~/components/profile/FavoritesPanel.vue'

const props = defineProps<{
  item: FavoriteItem
  type: string
}>()

defineEmits<{
  remove: [id: number]
  contact: [vendorId: number]
  order: [item: FavoriteItem]
  navigate: [item: FavoriteItem]
}>()

// Format price
function formatPrice(price: number): string {
  return price.toFixed(2)
}
</script>

<template>
  <NCard
    class="favorite-card"
    hoverable
  >
    <template #cover>
      <div class="relative h-48">
        <img
          :src="item.coverImage"
          class="w-full h-full object-cover"
          alt="封面图片"
        >
        <div class="absolute top-2 right-2">
          <NButton
            quaternary
            circle
            @click.stop="$emit('remove', item.id)"
          >
            <template #icon>
              <Heart fill="#f43f5e" :size="20" />
            </template>
          </NButton>
        </div>
      </div>
    </template>

    <div class="cursor-pointer" @click="$emit('navigate', item)">
      <h3 class="text-lg font-medium truncate">
        {{ item.name }}
      </h3>

      <div class="flex items-center mt-2">
        <NRate :value="item.rating" readonly size="small" />
        <span class="ml-1 text-sm">{{ item.rating.toFixed(1) }}</span>
        <span class="ml-2 text-sm text-gray-500">{{ item.reviewCount }}条评价</span>
      </div>

      <div class="flex justify-between items-center mt-2">
        <div class="text-primary text-lg font-bold">
          ¥{{ formatPrice(item.price) }}
          <span class="text-sm text-gray-500">
            {{ type === 'hotel' ? '/桌' : '' }}
          </span>
        </div>
        <div class="text-gray-500 text-sm">
          {{ item.location }}
        </div>
      </div>

      <div class="mt-2 text-sm text-gray-600 line-clamp-2">
        {{ item.description }}
      </div>

      <!-- Type-specific information -->
      <div v-if="type === 'photography'" class="mt-2 text-sm text-gray-600">
        <span class="mr-2">风格: {{ item.style }}</span>
      </div>

      <div v-if="type === 'hotel'" class="mt-2 text-sm text-gray-600">
        <span>容纳: {{ item.capacity }}桌</span>
      </div>

      <div v-if="type === 'host'" class="mt-2 text-sm text-gray-600">
        <span>经验: {{ item.experience }}年</span>
      </div>

      <div class="mt-3 flex flex-wrap gap-1">
        <NTag v-for="(tag, index) in item.tags" :key="index" size="small">
          {{ tag }}
        </NTag>
      </div>
    </div>

    <div class="flex justify-between mt-4">
      <NButton
        secondary
        @click="$emit('contact', item.vendorId)"
      >
        <template #icon>
          <MessageCircle :size="16" />
        </template>
        咨询商家
      </NButton>

      <NButton
        type="primary"
        @click="$emit('order', item)"
      >
        立即预订
      </NButton>
    </div>
  </NCard>
</template>

<style scoped>
.favorite-card {
  transition: all 0.3s ease;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
