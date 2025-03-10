<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NPagination, NSelect, NSpin } from 'naive-ui'
import { ClipboardList } from 'lucide-vue-next'
import { getOrdersPage } from '~/api/order'
import type { OrdersPageResponse, OrdersQueryParams } from '~/api/order/type'
import { ORDER_STATUS_OPTIONS } from '~/constants/order'
import OrderCard from '~/components/order/OrderCard.vue'
import { useUserStore } from '~/stores'

const router = useRouter()
const userStore = useUserStore()

// 订单列表数据
const orders = ref<OrdersPageResponse>({
  records: [],
  total: 0,
  size: 10,
  current: 1,
  pages: 0,
})

// 加载状态
const loading = ref(false)

// 查询参数
const queryParams = reactive<OrdersQueryParams>({
  pageNum: 1,
  pageSize: 8,
  orderStatus: undefined,
})

// 获取订单列表
async function fetchOrders() {
  loading.value = true
  try {
    const response = await getOrdersPage({
      ...queryParams,
      userId: userStore.userInfo?.id
    })
    if (response.code === 200) {
      orders.value = response.data
    } else {
      window.$message.error('获取订单列表失败')
    }
  } catch (error) {
    window.$message.error('获取订单列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  queryParams.pageNum = 1
  fetchOrders()
}

// 重置
function handleReset() {
  queryParams.orderStatus = undefined
  queryParams.weddingDateStart = undefined
  queryParams.weddingDateEnd = undefined
  queryParams.pageNum = 1
  fetchOrders()
}

// 查看订单详情
function viewDetails(id: number) {
  router.push(`/order/${id}`)
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="order-list-container">
    <!-- 头部横幅 -->
    <div class="banner relative h-48 bg-gradient-to-r from-purple-700 to-purple-500 mb-8 overflow-hidden">
      <div class="container mx-auto px-4 h-full flex flex-col justify-center z-10 relative">
        <h1 class="text-3xl font-bold text-white mb-2">
          我的订单
        </h1>
        <p class="text-lg text-white opacity-90">
          查看并管理您的所有订单
        </p>
      </div>
      <div class="absolute right-0 bottom-0 opacity-20">
        <ClipboardList :size="120" color="white" />
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- 筛选和列表部分 -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <!-- 筛选条件 -->
        <div class="flex gap-4 mb-6">
          <NSelect
            v-model:value="queryParams.orderStatus"
            placeholder="订单状态"
            :options="ORDER_STATUS_OPTIONS"
            clearable
          />
          <div class="flex gap-2">
            <NButton
              type="primary"
              :loading="loading"
              @click="handleSearch"
            >
              搜索
            </NButton>
            <NButton
              @click="handleReset"
            >
              重置
            </NButton>
          </div>
        </div>

        <!-- 订单列表 -->
        <div v-if="loading" class="py-8 flex justify-center">
          <NSpin size="large" />
        </div>
        <div v-else-if="orders.records.length === 0" class="text-center py-8 text-gray-500">
          暂无订单记录
        </div>
        <div v-else class="space-y-4">
          <template v-if="orders.records.length">
            <OrderCard
              v-for="order in orders.records"
              :key="order.id"
              :order="order"
              @view-details="viewDetails"
            />
          </template>
          <div v-else class="text-center py-8 text-gray-500">
            暂无订单记录
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="orders.records.length" class="flex justify-center mt-6">
          <NPagination
            v-model:page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :item-count="orders.total"
            show-size-picker
            :page-sizes="[10, 20, 30, 40]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-list-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}

.banner h1 {
  font-family: 'STZhongsong', 'SimSun', serif;
}
</style>
