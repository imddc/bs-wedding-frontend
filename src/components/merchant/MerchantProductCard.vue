<script setup lang="ts">
import { NButton, NTag } from 'naive-ui'
import { Star } from 'lucide-vue-next'
import type { Product } from '~/api/product/type'
import { handleImgUrl } from '~/utils/core'
// import { getMerchantTypeIcon } from '~/utils/merchant'

const props = defineProps<{
  product: Product
  merchantType?: number
}>()

const emit = defineEmits<{
  viewDetails: [id: number]
}>()

function handleViewDetails() {
  emit('viewDetails', props.product.id)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
    <!-- 商品图片 -->
    <div class="sm:w-1/3 h-48 bg-gray-100 overflow-hidden">
      <img
        v-if="product.mainImage"
        :src="handleImgUrl(product.mainImage)"
        :alt="product.productName"
        class="w-full h-full object-cover"
      >
      <!-- <div v-else class="w-full h-full flex items-center justify-center">
        <component
        :is="getMerchantTypeIcon(merchantType)"
        class="text-gray-400"
        :size="48"
        />
        </div> -->
    </div>

    <!-- 商品信息 -->
    <div class="sm:w-2/3 p-4">
      <!-- 标题和评分 -->
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-bold mb-2">
          {{ product.productName }}
        </h3>
        <div class="flex items-center">
          <Star class="text-yellow-400 mr-1" :size="16" />
          <span>{{ product.rating }}</span>
        </div>
      </div>

      <!-- 标签 -->
      <div class="flex flex-wrap gap-1 mb-2">
        <NTag v-if="product.categoryName" type="info" size="small">
          {{ product.categoryName }}
        </NTag>
        <NTag
          v-for="(tag, index) in product.tagsList"
          :key="index"
          type="success"
          size="small"
        >
          {{ tag }}
        </NTag>
      </div>

      <!-- 描述 -->
      <p class="text-gray-600 mb-3">
        {{ product.description || '暂无描述' }}
      </p>

      <!-- 底部价格和按钮 -->
      <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
        <div class="text-red-600 font-bold text-lg">
          ¥ {{ product.price.toLocaleString() }}
          <span class="text-gray-500 text-sm ml-1">起</span>
        </div>
        <div class="flex items-center gap-2">
          <NButton
            type="primary"
            color="#B91C1C"
            size="small"
            @click="handleViewDetails"
          >
            查看详情
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.n-tag {
  --n-border-radius: 4px;
}
</style>
