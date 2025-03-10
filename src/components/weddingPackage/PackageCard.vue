<script setup lang="ts">
import { NButton, NPopconfirm, NTag } from 'naive-ui'
import { CalendarClock, Coins, Heart, MapPin, ScrollText } from 'lucide-vue-next'
import { ProductType, ProductTypeMap, WeddingPackageStatus, WeddingPackageStatusMap } from '~/constants/weddingPackage'
import { handleImgUrl } from '~/utils/core'

defineProps<{
  package: {
    id: number
    packageName: string
    status: number
    location: string
    budget: number
    createTime: string
    totalPrice: number
    photographyProduct: any
    venueProduct: any
    hostProduct: any
  }
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'view'): void
  (e: 'delete'): void
}>()

// 格式化预算显示
function formatBudget(budget: number): string {
  return budget >= 10000 ? `${(budget / 10000).toFixed(1)}万` : `${budget}元`
}

// 获取状态标签类型
function getStatusTagType(status: number): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case WeddingPackageStatus.DRAFT:
      return 'warning'
    case WeddingPackageStatus.CONFIRMED:
      return 'success'
    default:
      return 'default'
  }
}
</script>

<template>
  <div class="package-card bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition relative">
    <div class="flex flex-col h-full">
      <div class="p-4 border-b border-gray-100">
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-bold mb-1 line-clamp-1 flex-1">
            {{ package.packageName }}
          </h3>
          <NTag :type="getStatusTagType(package.status)" size="small">
            {{ WeddingPackageStatusMap[package.status as keyof typeof WeddingPackageStatusMap] }}
          </NTag>
        </div>
        <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-2">
          <div class="flex items-center">
            <MapPin :size="14" class="mr-1" />
            <span>{{ package.location }}</span>
          </div>
          <div class="flex items-center">
            <Coins :size="14" class="mr-1" />
            <span>预算: {{ formatBudget(package.budget) }}</span>
          </div>
          <div class="flex items-center">
            <CalendarClock :size="14" class="mr-1" />
            <span>{{ new Date(package.createTime).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>

      <div class="p-4 flex-1">
        <div class="grid grid-cols-3 gap-3 mb-4">
          <!-- 婚纱摄影 -->
          <div class="flex flex-col overflow-hidden bg-pink-50 rounded-lg p-2">
            <div class="h-24 overflow-hidden rounded-md mb-2">
              <img
                v-if="package.photographyProduct?.mainImage"
                :src="handleImgUrl(package.photographyProduct.mainImage)"
                :alt="package.photographyProduct.productName"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <Heart class="text-pink-300" :size="24" />
              </div>
            </div>
            <div class="text-xs">
              <div class="font-bold line-clamp-1 text-pink-800">
                {{ ProductTypeMap[ProductType.PHOTOGRAPHY] }}
              </div>
              <div class="line-clamp-1">
                {{ package.photographyProduct.productName }}
              </div>
              <div class="text-pink-600">
                ¥{{ package.photographyProduct.price.toLocaleString() }}
              </div>
            </div>
          </div>

          <!-- 婚宴酒店 -->
          <div class="flex flex-col overflow-hidden bg-blue-50 rounded-lg p-2">
            <div class="h-24 overflow-hidden rounded-md mb-2">
              <img
                v-if="package.venueProduct?.mainImage"
                :src="handleImgUrl(package.venueProduct.mainImage)"
                :alt="package.venueProduct.productName"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <MapPin class="text-blue-300" :size="24" />
              </div>
            </div>
            <div class="text-xs">
              <div class="font-bold line-clamp-1 text-blue-800">
                {{ ProductTypeMap[ProductType.HOTEL] }}
              </div>
              <div class="line-clamp-1">
                {{ package.venueProduct.productName }}
              </div>
              <div class="text-blue-600">
                ¥{{ package.venueProduct.price.toLocaleString() }}
              </div>
            </div>
          </div>

          <!-- 司仪主持 -->
          <div class="flex flex-col overflow-hidden bg-purple-50 rounded-lg p-2">
            <div class="h-24 overflow-hidden rounded-md mb-2">
              <img
                v-if="package.hostProduct?.mainImage"
                :src="handleImgUrl(package.hostProduct.mainImage)"
                :alt="package.hostProduct.productName"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <ScrollText class="text-purple-300" :size="24" />
              </div>
            </div>
            <div class="text-xs">
              <div class="font-bold line-clamp-1 text-purple-800">
                {{ ProductTypeMap[ProductType.HOST] }}
              </div>
              <div class="line-clamp-1">
                {{ package.hostProduct.productName }}
              </div>
              <div class="text-purple-600">
                ¥{{ package.hostProduct.price.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mt-2">
          <div class="text-sm">
            <span class="text-gray-500">总价: </span>
            <span class="text-lg font-bold text-pink-700">¥{{ package.totalPrice.toLocaleString() }}</span>
          </div>
          <div class="flex gap-2">
            <NPopconfirm
              positive-text="确定"
              negative-text="取消"
              @positive-click="emit('delete')"
            >
              <template #trigger>
                <NButton size="small" type="error" ghost>
                  删除
                </NButton>
              </template>
              <template #default>
                <div class="max-w-[200px]">
                  <p class="font-medium mb-1">
                    确认删除
                  </p>
                  <p class="text-gray-500 text-sm">
                    是否确认删除该婚礼方案？此操作不可恢复。
                  </p>
                </div>
              </template>
            </NPopconfirm>
            <NButton
              size="small"
              type="primary"
              color="#DB2777"
              @click="emit('view')"
            >
              查看详情
            </NButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.package-card {
  transition: all 0.3s ease;
}

.package-card:hover {
  border-color: #db2777;
}

:deep(.n-button.n-button--error-type) {
  &:hover {
    color: #fff;
    background-color: #dc2626;
    border-color: #dc2626;
  }
}
</style>
