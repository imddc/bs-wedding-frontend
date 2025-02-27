<script setup lang="ts">
import { defineProps } from 'vue'
import type {
  LucideIcon,
} from 'lucide-vue-next'
import {
  Calendar,
  CheckCircle,
  HeadphonesIcon,
  Heart,
  Smile,
  Star,
  ThumbsUp,
  Trophy,
  Users,
} from 'lucide-vue-next'

defineProps<{
  number: string
  label: string
  icon: string
}>()

// Resolve icon component based on string name
function resolveIcon(iconName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    CheckCircle,
    Users,
    ThumbsUp,
    HeadphonesIcon,
    Heart,
    Calendar,
    Star,
    Smile,
    Trophy,
  }

  return iconMap[iconName] || CheckCircle
}
</script>

<template>
  <div class="statistic-item">
    <div
      class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm"
    >
      <component :is="resolveIcon(icon)" :size="36" class="text-white" />
    </div>

    <div class="text-3xl md:text-4xl font-bold">
      {{ number }}
    </div>
    <div class="text-lg mt-2 font-medium text-white/90">
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.statistic-item {
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.statistic-item:hover {
  transform: translateY(-8px);
}
</style>
