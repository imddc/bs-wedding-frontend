<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NDatePicker, NForm, NFormItem, NInput, NModal } from 'naive-ui'
import type { OrdersCreateParams } from '~/api/order/type'

const show = defineModel<boolean>('show')

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:show': [show: boolean]
  'confirm': [order: Pick<OrdersCreateParams, 'weddingDate' | 'remark'>]
}>()

const formData = ref({
  weddingDate: null,
  remark: '',
})

function handleClose() {
  emit('update:show', false)
}

function handleConfirm() {
  if (!formData.value.weddingDate) {
    window.$message.warning('请选择结婚日期')
    return
  }

  emit('confirm', {
    weddingDate: new Date(formData.value.weddingDate).toISOString(),
    remark: formData.value.remark,
  })
}
</script>

<template>
  <NModal
    v-model:show="show"
    :mask-closable="false"
    :bordered="false"
    preset="card"
    title="预约信息"
    class="max-w-md w-full mx-auto"
    closable
  >
    <NForm>
      <NFormItem label="结婚日期" required>
        <NDatePicker
          v-model:value="formData.weddingDate"
          value-format="yyyy-MM-dd"
          type="date"
          class="w-full"
          :first-day-of-week="1"
          :actions="['clear', 'now']"
          placeholder="请选择结婚日期"
        />
      </NFormItem>
      <NFormItem label="备注信息">
        <NInput
          v-model:value="formData.remark"
          type="textarea"
          placeholder="请输入备注信息（选填）"
          :rows="3"
        />
      </NFormItem>
    </NForm>
    <template #footer>
      <div class="flex justify-end gap-2">
        <NButton
          size="large"
          @click="handleClose"
        >
          取消
        </NButton>
        <NButton
          type="primary"
          size="large"
          :loading="loading"
          class="!bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600"
          @click="handleConfirm"
        >
          确认预约
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<style scoped>
:deep(.n-modal) {
  --n-title-font-size: 18px;
  --n-title-font-weight: 600;
  --n-title-text-color: rgb(153, 27, 27);
}

:deep(.n-form-item-label) {
  font-size: 15px;
  font-weight: 500;
}
</style>
