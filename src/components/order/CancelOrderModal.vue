<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NButton, NButtonGroup, NCard, NDivider, NForm, NFormItem, NInput, NModal, NPagination, NSelect, NSpace, NTag, NUpload, useLoadingBar, useMessage } from 'naive-ui'
import { OrderService } from '~/services/orderService'

// Define interfaces
interface Order {
  id: number
  orderNo: string
  listingName?: string
  productName?: string
  productImage: string
  totalAmount: number
}

const props = defineProps<{
  show: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'cancel-success': [orderId: number]
}>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)

// Internal show state
const showInternal = computed({
  get: () => props.show,
  set: value => emit('update:show', value),
})

// Form state
const formValue = ref({
  reason: '',
  otherReason: '',
})

const submitting = ref(false)

// Form validation rules
const rules: FormRules = {
  reason: [
    { required: true, message: '请选择取消原因', trigger: 'blur' },
  ],
  otherReason: [
    {
      required: true,
      message: '请输入取消原因',
      trigger: 'blur',
      validator: (rule, value) => {
        if (formValue.value.reason === 'other' && !value.trim()) {
          return new Error('请输入取消原因')
        }
        return true
      },
    },
  ],
}

// Cancel reason options
const cancelReasonOptions = [
  { label: '计划有变', value: 'change_plan' },
  { label: '找到更合适的选择', value: 'better_option' },
  { label: '价格原因', value: 'price_issue' },
  { label: '不小心下错单', value: 'mistake' },
  { label: '服务商要求取消', value: 'vendor_request' },
  { label: '其他原因', value: 'other' },
]

// Check if form is valid
const isFormValid = computed(() => {
  if (!formValue.value.reason) {
    return false
  }

  if (formValue.value.reason === 'other' && !formValue.value.otherReason.trim()) {
    return false
  }

  return true
})

// Format price
function formatPrice(price: number): string {
  return price.toLocaleString('zh-CN')
}

// Confirm cancel order
async function confirmCancel() {
  if (!props.order)
    return

  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('请检查表单中的错误')
      return
    }

    submitting.value = true

    try {
      // Get the actual reason text to send
      const reason = formValue.value.reason === 'other'
        ? formValue.value.otherReason
        : cancelReasonOptions.find(opt => opt.value === formValue.value.reason)?.label || formValue.value.reason

      const { data } = await OrderService.cancelOrder(props.order.id, reason)

      if (data.code === 200) {
        message.success('订单已取消')
        emit('cancel-success', props.order.id)
      } else {
        message.error(data.message || '取消订单失败')
      }
    } catch (error) {
      message.error('取消订单失败，请检查网络连接')
      console.error('Error cancelling order:', error)
    } finally {
      submitting.value = false
    }
  })
}

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    formValue.value = {
      reason: '',
      otherReason: '',
    }
  }
})
</script>

<template>
  <NModal
    v-model:show="showInternal"
    preset="card"
    title="取消订单"
    style="width: 500px;"
    :mask-closable="false"
  >
    <div v-if="order">
      <div class="p-4 bg-gray-50 rounded-lg mb-4">
        <div class="flex mb-3">
          <div class="w-16 h-16 flex-shrink-0">
            <img
              :src="order.productImage"
              alt="商品图片"
              class="w-full h-full object-cover rounded"
            >
          </div>

          <div class="ml-4">
            <h3 class="text-lg font-medium">
              {{ order.listingName || order.productName }}
            </h3>
            <div class="text-primary font-medium mt-1">
              ¥{{ formatPrice(order.totalAmount) }}
            </div>
            <p class="text-gray-500 text-sm">
              订单号: {{ order.orderNo }}
            </p>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <div class="text-base font-medium mb-2">
          确定要取消此订单吗？
        </div>
        <div class="text-sm text-gray-500">
          取消订单后，系统将自动解除资源的预占用。如果您已经支付，款项将退回至原支付账户，退款将在1-7个工作日内完成。
        </div>
      </div>

      <NForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
      >
        <NFormItem label="取消原因" path="reason">
          <NSelect
            v-model:value="formValue.reason"
            :options="cancelReasonOptions"
            placeholder="请选择取消原因"
          />
        </NFormItem>

        <NFormItem
          v-if="formValue.reason === 'other'"
          label="其他原因"
          path="otherReason"
        >
          <NInput
            v-model:value="formValue.otherReason"
            type="textarea"
            placeholder="请输入取消原因..."
            :autosize="{ minRows: 2, maxRows: 3 }"
          />
        </NFormItem>
      </NForm>

      <div class="flex justify-end mt-6">
        <NSpace>
          <NButton @click="showInternal = false">
            返回
          </NButton>
          <NButton
            type="error"
            :disabled="!isFormValid"
            :loading="submitting"
            @click="confirmCancel"
          >
            确认取消
          </NButton>
        </NSpace>
      </div>
    </div>
  </NModal>
</template>
