<script setup lang="ts">
import { NButton, NTag } from 'naive-ui'
import type { OrdersDetailResponse } from '~/api/order/type'

const props = defineProps<{
  order: OrdersDetailResponse
}>()

const emit = defineEmits<{
  viewDetails: [id: number]
}>()

// 获取状态类型
function getStatusType(status: number) {
  const statusMap: Record<number, 'success' | 'warning' | 'error' | 'default'> = {
    0: 'default', // 待确认
    1: 'success', // 已确认
    2: 'warning', // 已取消
    3: 'error', // 已拒绝
  }
  return statusMap[status] || 'default'
}

function handleViewDetails() {
  emit('viewDetails', props.order.id)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
    <!-- 订单头部信息 -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex items-center flex-wrap gap-2">
        <span class="text-gray-500">订单号：{{ order.orderNo }}</span>
        <NTag :type="getStatusType(order.orderStatus)" round>
          {{ order.orderStatusDesc }}
        </NTag>
      </div>
      <span class="text-gray-500 text-sm">{{ order.createTime }}</span>
    </div>

    <!-- 订单详情 -->
    <div class="space-y-2 mb-4">
      <div v-if="order.weddingDate" class="text-sm text-gray-500 flex items-center">
        <div class="i-carbon-calendar mr-1.5" />
        婚礼日期：{{ order.weddingDate }}
      </div>
      <div v-if="order.remark" class="text-sm text-gray-500 flex items-center">
        <div class="i-carbon-note mr-1.5" />
        备注：{{ order.remark }}
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3">
      <NButton
        type="primary"
        size="small"
        class="!bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600"
        @click="handleViewDetails"
      >
        查看详情
      </NButton>
    </div>
  </div>
</template>

<style scoped>
.n-tag {
  --n-border-radius: 12px;
}
</style>
