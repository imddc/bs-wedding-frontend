<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'
import { NButton, NButtonGroup, NCard, NPagination, useMessage } from 'naive-ui'
import { ShoppingBag } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

// Import components
import OrderCard from '~/components/order/OrderCard.vue'
import PaymentModal from '~/components/order/PaymentModal.vue'
import ReviewModal from '~/components/order/ReviewModal.vue'
import CancelOrderModal from '~/components/order/CancelOrderModal.vue'

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

const props = defineProps<{
  orders: Order[]
}>()

const message = useMessage()
const router = useRouter()

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = computed(() => Math.ceil(totalOrders.value / pageSize.value))
const totalOrders = computed(() => filteredOrders.value.length)

// Filter
const orderStatus = ref<number | null>(null)
const filteredOrders = computed(() => {
  let result = [...props.orders]

  if (orderStatus.value !== null) {
    result = result.filter(order => order.status === orderStatus.value)
  }

  // Calculate pagination
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value

  return result.slice(startIndex, endIndex)
})

// Modals
const showPaymentModal = ref(false)
const showReviewModal = ref(false)
const showCancelModal = ref(false)
const selectedOrder = ref<Order | null>(null)

// Watch for orders changes
watch(() => props.orders, () => {
  currentPage.value = 1
})

// Handler for page size changes
function handlePageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}

// Change order status filter
function changeOrderStatus(status: number | null) {
  orderStatus.value = status
  currentPage.value = 1
}

// Pay order
function payOrder(orderId: number) {
  const order = props.orders.find(o => o.id === orderId)
  if (order) {
    selectedOrder.value = order
    showPaymentModal.value = true
  }
}

// Handle payment success
function handlePaymentSuccess(orderId: number) {
  // Find the order in the original array and update its status
  const orderIndex = props.orders.findIndex(o => o.id === orderId)
  if (orderIndex !== -1) {
    props.orders[orderIndex].status = 1
  }
  showPaymentModal.value = false
}

// View order detail
function viewOrderDetail(orderId: number) {
  router.push(`/orders/${orderId}`)
}

// Contact vendor
function contactVendor(vendorId: number) {
  router.push(`/messages?vendorId=${vendorId}`)
}

// Write review
function writeReview(orderId: number) {
  const order = props.orders.find(o => o.id === orderId)
  if (order) {
    selectedOrder.value = order
    showReviewModal.value = true
  }
}

// Handle review success
function handleReviewSuccess(orderId: number) {
  // Find the order in the original array and update its hasReview flag
  const orderIndex = props.orders.findIndex(o => o.id === orderId)
  if (orderIndex !== -1) {
    props.orders[orderIndex].hasReview = true
  }
  showReviewModal.value = false
}

// Cancel order
function cancelOrder(orderId: number) {
  const order = props.orders.find(o => o.id === orderId)
  if (order) {
    selectedOrder.value = order
    showCancelModal.value = true
  }
}

// Handle cancel success
function handleCancelSuccess(orderId: number) {
  // Remove the cancelled order from the original array
  const orderIndex = props.orders.findIndex(o => o.id === orderId)
  if (orderIndex !== -1) {
    props.orders.splice(orderIndex, 1)
  }
  showCancelModal.value = false
}
</script>

<template>
  <div>
    <NCard title="我的订单" class="mb-4">
      <template #header-extra>
        <NButtonGroup>
          <NButton
            :type="orderStatus === null ? 'primary' : 'default'"
            @click="changeOrderStatus(null)"
          >
            全部订单
          </NButton>
          <NButton
            :type="orderStatus === 0 ? 'primary' : 'default'"
            @click="changeOrderStatus(0)"
          >
            待付款
          </NButton>
          <NButton
            :type="orderStatus === 1 ? 'primary' : 'default'"
            @click="changeOrderStatus(1)"
          >
            已付款
          </NButton>
          <NButton
            :type="orderStatus === 2 ? 'primary' : 'default'"
            @click="changeOrderStatus(2)"
          >
            已完成
          </NButton>
        </NButtonGroup>
      </template>

      <div v-if="filteredOrders.length === 0" class="text-center py-16">
        <ShoppingBag class="mx-auto mb-4 text-gray-300" :size="48" />
        <p class="text-gray-500">
          暂无相关订单
        </p>
      </div>

      <div v-else>
        <div v-for="order in filteredOrders" :key="order.id" class="mb-4">
          <OrderCard
            :order="order"
            @pay="payOrder"
            @cancel="cancelOrder"
            @view-detail="viewOrderDetail"
            @contact-vendor="contactVendor"
            @write-review="writeReview"
          />
        </div>

        <NPagination
          v-model:page="currentPage"
          :page-count="totalPages"
          :page-size="pageSize"
          :item-count="totalOrders"
          show-size-picker
          :page-sizes="[10, 20, 30]"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </NCard>

    <!-- Payment Modal -->
    <PaymentModal
      v-model:show="showPaymentModal"
      :order="selectedOrder"
      @payment-success="handlePaymentSuccess"
    />

    <!-- Review Modal -->
    <ReviewModal
      v-model:show="showReviewModal"
      :order="selectedOrder"
      @review-success="handleReviewSuccess"
    />

    <!-- Cancel Order Modal -->
    <CancelOrderModal
      v-model:show="showCancelModal"
      :order="selectedOrder"
      @cancel-success="handleCancelSuccess"
    />
  </div>
</template>
