<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NForm, NFormItem, NModal, NSelect, NSpace } from 'naive-ui'
import { updateOrderStatus } from '~/api/order'
import { ORDER_STATUS, ORDER_STATUS_DESCRIPTIONS } from '~/constants/order'

const props = defineProps<{
  show: boolean
  orderId: number | null
  currentStatus: number | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const loading = ref(false)
const selectedStatus = ref<number | null>(null)

// 计算可选的状态选项
const statusOptions = computed(() => {
  const allStatusOptions = [
    { label: ORDER_STATUS_DESCRIPTIONS[ORDER_STATUS.PENDING_PAYMENT], value: ORDER_STATUS.PENDING_PAYMENT },
    { label: ORDER_STATUS_DESCRIPTIONS[ORDER_STATUS.PAID], value: ORDER_STATUS.PAID },
    { label: ORDER_STATUS_DESCRIPTIONS[ORDER_STATUS.COMPLETED], value: ORDER_STATUS.COMPLETED },
    { label: ORDER_STATUS_DESCRIPTIONS[ORDER_STATUS.CANCELLED], value: ORDER_STATUS.CANCELLED },
  ]

  // 从选项中排除当前状态
  return allStatusOptions.filter(option => option.value !== props.currentStatus)
})

// 处理状态更新
async function handleUpdateStatus() {
  if (!props.orderId || selectedStatus.value === null)
    return

  try {
    loading.value = true

    const response = await updateOrderStatus({
      id: props.orderId,
      orderStatus: selectedStatus.value,
    })

    if (response.success) {
      window.$message.success(`订单状态已更新为${ORDER_STATUS_DESCRIPTIONS[selectedStatus.value]}`)
      emit('success')
      emit('close')
    } else {
      window.$message.error(response.message || '更新订单状态失败')
    }
  } catch (error) {
    console.error('更新订单状态出错:', error)
    window.$message.error('更新订单状态出错')
  } finally {
    loading.value = false
  }
}

// 取消操作
function handleCancel() {
  selectedStatus.value = null
  emit('close')
}
</script>

<template>
  <NModal
    v-model:show="props.show"
    preset="card"
    title="更新订单状态"
    :mask-closable="false"
    style="width: 500px"
  >
    <NForm>
      <NFormItem label="新状态">
        <NSelect
          v-model:value="selectedStatus"
          :options="statusOptions"
          placeholder="请选择新的订单状态"
        />
      </NFormItem>

      <NSpace justify="end">
        <NButton :disabled="loading" @click="handleCancel">
          取消
        </NButton>
        <NButton
          type="primary"
          :loading="loading"
          :disabled="selectedStatus === null"
          @click="handleUpdateStatus"
        >
          更新状态
        </NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>
