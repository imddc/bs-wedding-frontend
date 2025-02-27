<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import type {
  LucideIcon,
} from 'lucide-vue-next'
import {
  CalendarDays,
  Camera,
  HeartHandshake,
  Home,
  Mic,
  Users,
} from 'lucide-vue-next'
import { NButton, NCard } from 'naive-ui'

interface StatItem {
  label: string
  value: string
}

defineProps<{
  title: string
  description: string
  icon: string
  image: string
  stats: StatItem[]
  buttonText: string
}>()

defineEmits<{
  click: []
}>()

// Resolve icon component based on string name
function resolveIcon(iconName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    Camera,
    Home,
    Users,
    Mic,
    Calendar: CalendarDays,
    Heart: HeartHandshake,
  }

  return iconMap[iconName] || Camera
}
</script>

<template>
  <div class="service-card group h-full">
    <NCard class="h-full overflow-hidden transition-all duration-300 hover:shadow-lg" hoverable>
      <!-- Card Header with Image -->
      <div class="relative h-60 -mx-4 -mt-4 mb-6 overflow-hidden">
        <img
          :src="image"
          :alt="title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        >
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />

        <!-- Icon Badge -->
        <div class="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
          <component :is="resolveIcon(icon)" :size="24" class="text-primary" />
        </div>

        <!-- Title -->
        <div class="absolute bottom-0 left-0 p-4">
          <h3 class="text-2xl font-bold text-white">
            {{ title }}
          </h3>
        </div>
      </div>

      <!-- Card Content -->
      <p class="text-gray-600 mb-6 h-14 line-clamp-2">
        {{ description }}
      </p>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-2 mb-6">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="text-center p-2 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors"
        >
          <div class="font-bold text-primary">
            {{ stat.value }}
          </div>
          <div class="text-xs text-gray-500">
            {{ stat.label }}
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="mt-auto text-center">
        <NButton
          type="primary"
          block
          @click="$emit('click')"
        >
          {{ buttonText }}
        </NButton>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
