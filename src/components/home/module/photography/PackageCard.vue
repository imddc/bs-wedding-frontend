<script setup lang="ts">
import { ChevronRight, Star } from 'lucide-vue-next'
import { NButton, NTag } from 'naive-ui'
import { handleImgUrl } from '~/utils/core'

withDefaults(defineProps<{
  image: string
  title: string
  studio: string
  price: number
  featured: boolean
}>(), {
  featured: false,
})
</script>

<template>
  <div class="flex flex-col bg-white rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-100">
    <!-- Package Image -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="handleImgUrl(image)"
        :alt="title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      >
      <div v-if="featured" class="absolute top-2 right-2">
        <NTag type="warning" size="small">
          <template #icon>
            <Star :size="12" />
          </template>
          推荐
        </NTag>
      </div>
    </div>

    <!-- Package Info -->
    <div class="p-3 flex flex-col flex-grow">
      <h3 class="text-sm font-medium line-clamp-1 mb-1" :title="title">
        {{ title }}
      </h3>
      <p class="text-xs text-gray-500 line-clamp-1 mb-3">
        {{ studio }}
      </p>

      <!-- Price -->
      <div class="mt-auto flex items-center justify-between">
        <span class="text-red-500 font-medium">
          ¥<span class="text-base">{{ price.toLocaleString() }}</span>
        </span>
        <NButton size="tiny" quaternary circle>
          <template #icon>
            <ChevronRight :size="16" />
          </template>
        </NButton>
      </div>
    </div>
  </div>
</template>
