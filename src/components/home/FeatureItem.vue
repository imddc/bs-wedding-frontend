<script setup lang="ts">
import { defineProps } from 'vue'
import type {
  LucideIcon,
} from 'lucide-vue-next'
import {
  Calendar,
  CheckSquare,
  Clock,
  Gift,
  Heart,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-vue-next'

defineProps<{
  title: string
  description: string
  icon: string
}>()

// Resolve icon component based on string name
function resolveIcon(iconName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    Sparkles,
    Wallet,
    Calendar,
    CheckSquare,
    Heart,
    Clock,
    MapPin,
    Gift,
    Shield,
    Star,
  }

  return iconMap[iconName] || Sparkles
}
</script>

<template>
  <div class="feature-item p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
      <component :is="resolveIcon(icon)" :size="20" class="text-primary" />
    </div>

    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-1">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-600">
        {{ description }}
      </p>
    </div>
  </div>
</template>
