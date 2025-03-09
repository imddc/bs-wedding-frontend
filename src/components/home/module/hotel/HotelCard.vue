<script setup lang="ts">
import { handleImgUrl } from '~/utils/core'
import type { Hotel } from './type'

defineProps<{
  hotel: Hotel
}>()
</script>

<template>
  <div class="flex bg-white rounded-md overflow-hidden hover:shadow-sm transition-all">
    <!-- Hotel Image -->
    <div class="w-24 h-24 flex-shrink-0">
      <img
        :src="handleImgUrl(hotel.image)"
        :alt="hotel.name"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- Hotel Info -->
    <div class="flex flex-col flex-grow p-2">
      <h4 class="font-medium text-sm mb-1">
        {{ hotel.name }}
      </h4>

      <!-- Rating -->
      <div class="flex items-center mb-1">
        <span class="bg-yellow-100 text-yellow-800 text-xs px-1 rounded">综合 {{ hotel.rating }}</span>
      </div>

      <!-- Features & Location -->
      <div class="flex items-center text-xs text-gray-500 mb-1">
        <span class="mr-2">{{ hotel.features.join(' ') }}</span>
        <span>{{ hotel.location }}</span>
      </div>

      <!-- Tables -->
      <div class="text-xs text-gray-500 mb-1">
        {{ hotel.tables }}
      </div>

      <!-- Price -->
      <div class="mt-auto">
        <span class="text-red-500 font-medium text-sm">
          ¥{{ hotel.price }}/桌
          <span class="text-xs text-gray-400">起</span>
        </span>
      </div>
    </div>
  </div>
</template>
