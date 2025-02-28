<script setup lang="ts">
import { NBadge, NRate } from 'naive-ui'
import { Check, Star } from 'lucide-vue-next'
import type { Studio } from '~/pages/(user)/index/photoGraphy/type'

withDefaults(defineProps<{
  studio: Studio
}>(), {})
</script>

<template>
  <div class="w-full border-b border-gray-200 py-6">
    <div class="flex">
      <!-- Studio Logo/Cover Image -->
      <div class="w-40 h-40 flex-shrink-0 bg-red-900 rounded overflow-hidden">
        <img :src="studio.coverImage" :alt="studio.name" class="w-full h-full object-cover">
      </div>

      <!-- Studio Information -->
      <div class="flex-grow ml-4">
        <div class="flex items-center">
          <h2 class="text-xl font-medium">
            {{ studio.name }}
          </h2>

          <!-- Badges -->
          <div class="ml-2 flex gap-1">
            <NBadge type="success" class="px-1">
              <template #default>
                <div class="flex items-center text-xs">
                  <Check class="w-3 h-3 mr-0.5" />
                  <span>无忧订</span>
                </div>
              </template>
            </NBadge>
          </div>
        </div>

        <!-- Rating -->
        <div class="flex items-center mt-2">
          <NRate :value="3" readonly />
          <span class="mx-2 text-gray-300">|</span>
          <span class="text-sm text-gray-500">{{ studio.location }}</span>
          <span class="mx-2 text-gray-300">|</span>
          <span class="text-sm text-gray-500">预约免费车接送店</span>
        </div>

        <!-- Coupon and Starting Price -->
        <div class="flex justify-between mt-14">
          <div class="text-xl font-bold text-red-500">
            ¥{{ studio.priceRange }}
          </div>
        </div>
      </div>

      <!-- Studio Feature Image -->
      <div class="w-56 h-32 ml-4 relative rounded overflow-hidden">
        <img :src="studio.subImages[0]" alt="Studio feature" class="w-full h-full object-cover">
        <div class="absolute top-0 left-0 bg-red-500 text-white px-2 py-0.5 text-xs">
          本店主推
        </div>
      </div>
    </div>
  </div>
</template>
