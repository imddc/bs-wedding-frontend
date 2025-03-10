<script setup lang="ts">
import { Star, Image } from 'lucide-vue-next'
import { handleImgUrl } from '~/utils/core'

interface Props {
  product: {
    mainImage?: string
    productName: string
    description?: string
    price: number
    rating: number
  }
  showHotTag?: boolean
  size?: 'large' | 'default'
}

withDefaults(defineProps<Props>(), {
  showHotTag: false,
  size: 'default'
})
</script>

<template>
  <div
    class="transition-all duration-300 group"
    :class="[
      size === 'large' ? 'w-[80%] mx-auto' : 'w-full'
    ]"
  >
    <div
      class="relative overflow-hidden rounded-t-lg"
      :class="[
        size === 'large' ? 'h-[280px]' : 'h-[240px]'
      ]"
    >
      <img
        v-if="product.mainImage"
        :src="handleImgUrl(product.mainImage)"
        :alt="product.productName"
        class="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
      >
      <div
        v-else
        class="w-full h-full bg-gray-200 flex items-center justify-center"
      >
        <Image
          class="text-gray-400"
          :size="size === 'large' ? 64 : 48"
        />
      </div>
      <div
        v-if="showHotTag"
        class="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-red-600/90 text-white backdrop-blur-sm"
        :class="[
          size === 'large' ? 'text-base' : 'text-sm'
        ]"
      >
        热门
      </div>
    </div>
    <div
      class="p-4 border-t-0 border border-gray-200 rounded-b-lg bg-white transition-shadow group-hover:shadow-md"
      :class="[
        size === 'large' ? 'p-6' : 'p-4'
      ]"
    >
      <h3
        class="font-bold mb-2 line-clamp-1"
        :class="[
          size === 'large' ? 'text-xl' : 'text-lg'
        ]"
      >
        {{ product.productName }}
      </h3>
      <p
        class="text-gray-600 mb-3 line-clamp-2"
        :class="[
          size === 'large' ? 'text-base' : 'text-sm'
        ]"
      >
        {{ product.description || '暂无描述' }}
      </p>
      <div class="flex justify-between items-center">
        <div
          class="text-red-600 font-bold"
          :class="[
            size === 'large' ? 'text-2xl' : 'text-lg'
          ]"
        >
          ￥{{ product.price.toLocaleString() }}
        </div>
        <div class="flex items-center">
          <Star
            class="text-yellow-400 mr-1"
            :size="size === 'large' ? 20 : 16"
          />
          <span
            class="text-gray-600"
            :class="[
              size === 'large' ? 'text-base' : 'text-sm'
            ]"
          >
            {{ product.rating }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
