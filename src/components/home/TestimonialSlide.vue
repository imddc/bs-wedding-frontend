<script setup lang="ts">
import { defineProps } from 'vue'
import { QuoteIcon } from 'lucide-vue-next'
import { NRate, NTag } from 'naive-ui'
import { handleImgUrl } from '~/utils/core'

interface TestimonialServices {
  photography?: boolean
  hotel?: boolean
  host?: boolean
  plan?: boolean
}

interface Testimonial {
  id: number
  name: string
  avatar: string
  location: string
  date: string
  content: string
  rating: number
  services?: TestimonialServices
}

defineProps<{
  testimonial: Testimonial
}>()
</script>

<template>
  <div class="testimonial-slide px-4 py-8 md:py-12">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6 md:p-8 flex flex-col md:flex-row gap-8">
        <!-- Couple Photo & Info -->
        <div class="flex-shrink-0 text-center">
          <div class="relative w-40 h-40 mx-auto overflow-hidden rounded-full border-4 border-white shadow">
            <img
              :src="handleImgUrl(testimonial.avatar)"
              :alt="testimonial.name"
              class="w-full h-full object-cover"
            >
          </div>

          <div class="mt-4">
            <h4 class="text-xl font-bold text-gray-800">
              {{ testimonial.name }}
            </h4>
            <div class="text-sm text-gray-500 mb-2">
              {{ testimonial.location }}
            </div>
            <div class="text-sm text-gray-400">
              {{ testimonial.date }}
            </div>

            <div class="mt-3 flex justify-center">
              <NRate :value="testimonial.rating" readonly size="small" />
            </div>
          </div>
        </div>

        <!-- Testimonial Content -->
        <div class="flex-grow">
          <div class="relative">
            <QuoteIcon class="absolute -top-4 -left-2 w-12 h-12 text-primary opacity-20" />

            <div class="relative pt-4">
              <p class="text-lg text-gray-600 leading-relaxed">
                {{ testimonial.content }}
              </p>

              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex flex-wrap gap-2">
                  <NTag v-if="testimonial.services?.photography" type="info" size="small">
                    婚纱摄影
                  </NTag>
                  <NTag v-if="testimonial.services?.hotel" type="success" size="small">
                    婚宴酒店
                  </NTag>
                  <NTag v-if="testimonial.services?.host" type="warning" size="small">
                    司仪主持
                  </NTag>
                  <NTag v-if="testimonial.services?.plan" type="primary" size="small">
                    婚礼方案
                  </NTag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
