<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { NButton, NButtonGroup, NCard, NDivider, NForm, NFormItem, NInput, NModal, NPagination, NRadioButton, NRadioGroup, NSelect, NSpace, NTag, NUpload, useLoadingBar, useMessage } from 'naive-ui'
import { BugIcon } from 'lucide-vue-next'
import { OrderService } from '~/services/orderService'

// Define interface for Order
interface Order {
  id: number
  orderNo: string
  totalAmount: number
}

const props = defineProps<{
  show: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'payment-success': [orderId: number]
}>()

const message = useMessage()

// Internal show state
const showInternal = computed({
  get: () => props.show,
  set: value => emit('update:show', value),
})

// Payment state
const paymentMethod = ref('')
const paymentLoading = ref(false)

// Format price
function formatPrice(price: number): string {
  return price.toFixed(2)
}

// Confirm payment
async function confirmPayment() {
  if (!props.order || !paymentMethod.value)
    return

  try {
    paymentLoading.value = true

    const { data } = await OrderService.payOrder(props.order.id, paymentMethod.value)

    if (data.code === 200) {
      message.success('支付成功')
      emit('payment-success', props.order.id)
    } else {
      message.error(data.message || '支付失败')
    }
  } catch (error) {
    message.error('支付请求失败，请检查网络连接')
    console.error('Error processing payment:', error)
  } finally {
    paymentLoading.value = false
  }
}

// Reset payment method when modal is opened
watch(() => props.show, (newValue) => {
  if (newValue) {
    paymentMethod.value = ''
  }
})
</script>

<template>
  <NModal
    v-model:show="showInternal"
    preset="card"
    title="订单支付"
    style="width: 500px"
  >
    <div v-if="order">
      <div class="text-center mb-6">
        <h3 class="text-lg font-bold mb-2">
          订单金额
        </h3>
        <p class="text-3xl font-bold text-orange-500">
          ¥{{ formatPrice(order.totalAmount) }}
        </p>
      </div>

      <NDivider>选择支付方式</NDivider>

      <NRadioGroup v-model:value="paymentMethod" name="paymentMethod">
        <div class="grid grid-cols-1 gap-4">
          <NRadioButton value="alipay" class="flex items-center h-16">
            <BugIcon class="h-8 mr-2" />
            <span>支付宝</span>
          </NRadioButton>

          <NRadioButton value="wechat" class="flex items-center h-16">
            <BugIcon class="h-8 mr-2" />
            <span>微信支付</span>
          </NRadioButton>

          <NRadioButton value="unionpay" class="flex items-center h-16">
            <BugIcon class="h-8 mr-2" />
            <span>银联支付</span>
          </NRadioButton>
        </div>
      </NRadioGroup>

      <div class="flex justify-end mt-6">
        <NSpace>
          <NButton @click="showInternal = false">
            取消
          </NButton>
          <NButton
            type="primary"
            :disabled="!paymentMethod"
            :loading="paymentLoading"
            @click="confirmPayment"
          >
            确认支付
          </NButton>
        </NSpace>
      </div>
    </div>
  </NModal>
</template>
