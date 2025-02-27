<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { NButton, NButtonGroup, NCard, NDivider, NForm, NFormItem, NInput, NModal, NPagination, NSelect, NSpace, NTag, NUpload, useLoadingBar, useMessage } from 'naive-ui'

// Define props with TypeScript interface
interface Order {
  id: number
  orderNo: string
  status: number
  productName: string
  productDescription: string
  productImage: string
  type: string
  vendorId: number
  totalAmount: number
  serviceDate: string
  createdTime: string
  hasReview: boolean
}

defineProps<{
  order: Order
}>()

// Define emits
defineEmits<{
  'pay': [orderId: number]
  'view-detail': [orderId: number]
  'contact-vendor': [vendorId: number]
  'write-review': [orderId: number]
  'cancel': [orderId: number]
}>()

// Get order tag type
function getOrderTagType(status: number): string {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'info'
    case 2: return 'success'
    default: return 'default'
  }
}

// Get order status text
function getOrderStatusText(status: number): string {
  switch (status) {
    case 0: return '待付款'
    case 1: return '已付款'
    case 2: return '已完成'
    default: return '未知状态'
  }
}

// Format date
function formatDate(dateString: string): string {
  if (!dateString)
    return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Format price
function formatPrice(price: number): string {
  return price.toFixed(2)
}
</script>

<template>
  <NCard class="order-card" hoverable>
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <NTag :type="getOrderTagType(order.status)">
          {{ getOrderStatusText(order.status) }}
        </NTag>
        <span class="ml-2 text-gray-500">订单号: {{ order.orderNo }}</span>
      </div>
      <span class="text-gray-500">下单时间: {{ formatDate(order.createdTime) }}</span>
    </div>

    <NDivider />

    <div class="flex">
      <div class="w-16 h-16 flex-shrink-0">
        <img
          :src="order.productImage"
          alt="商品图片"
          class="w-full h-full object-cover rounded"
        >
      </div>

      <div class="ml-4 flex-grow">
        <div class="flex justify-between">
          <div>
            <h3 class="text-lg font-medium">
              {{ order.productName }}
            </h3>
            <p class="text-gray-500">
              {{ order.productDescription }}
            </p>
            <div class="flex mt-2">
              <NTag v-if="order.type === 'photography'" type="info">
                婚纱摄影
              </NTag>
              <NTag v-else-if="order.type === 'hotel'" type="success">
                婚宴酒店
              </NTag>
              <NTag v-else-if="order.type === 'host'" type="warning">
                司仪主持
              </NTag>
              <span class="ml-2 text-gray-500">服务日期: {{ formatDate(order.serviceDate) }}</span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-lg font-bold">
              ¥{{ formatPrice(order.totalAmount) }}
            </div>

            <div class="mt-4 space-x-2">
              <NButton
                v-if="order.status === 0"
                type="primary"
                @click="$emit('pay', order.id)"
              >
                立即付款
              </NButton>

              <NButton
                v-if="order.status === 1"
                @click="$emit('view-detail', order.id)"
              >
                查看详情
              </NButton>

              <NButton
                v-if="order.status === 1 && order.type !== 'hotel'"
                type="primary"
                @click="$emit('contact-vendor', order.vendorId)"
              >
                联系商家
              </NButton>

              <NButton
                v-if="order.status === 2"
                @click="$emit('write-review', order.id)"
              >
                {{ order.hasReview ? '查看评价' : '写评价' }}
              </NButton>

              <NButton
                v-if="order.status === 0"
                secondary
                @click="$emit('cancel', order.id)"
              >
                取消订单
              </NButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NCard>
</template>

<style scoped>
.order-card {
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
