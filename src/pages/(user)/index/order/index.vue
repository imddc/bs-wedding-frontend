<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NPagination, NSelect, NSpin, NTag } from 'naive-ui'
import { ClipboardList } from 'lucide-vue-next'
import { getOrdersPage } from '~/api/order'
import type { OrdersPageResponse, OrdersQueryParams } from '~/api/order/type'
import { ORDER_STATUS_OPTIONS } from '~/constants/product'

const router = useRouter()

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
    const response = await getOrdersPage(queryParams)
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

// 获取订单状态标签类型
function getStatusType(status: number) {
  const typeMap: Record<number, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    1: 'warning', // 待付款
    2: 'info', // 已付款
    3: 'success', // 已确认
    4: 'success', // 已完成
    5: 'error', // 已取消
  }
  return typeMap[status] || 'default'
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
        <div class="flex flex-wrap gap-4 mb-6">
          <NSelect
            v-model:value="queryParams.orderStatus"
            placeholder="订单状态"
            :options="ORDER_STATUS_OPTIONS"
            clearable
            class="w-40"
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
          <div
            v-for="order in orders.records"
            :key="order.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <span class="text-gray-500 mr-2">订单号：{{ order.orderNo }}</span>
                <NTag :type="getStatusType(order.orderStatus)">
                  {{ order.orderStatusDesc }}
                </NTag>
              </div>
              <span class="text-gray-500">{{ order.createTime }}</span>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div v-if="order.weddingDate" class="text-sm text-gray-500 mb-1">
                  婚礼日期：{{ order.weddingDate }}
                </div>
                <div v-if="order.remark" class="text-sm text-gray-500">
                  备注：{{ order.remark }}
                </div>
              </div>
              <div class="flex items-center gap-4">
                <NButton
                  type="primary"
                  size="small"
                  @click="viewDetails(order.id)"
                >
                  查看详情
                </NButton>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="orders.records.length > 0" class="mt-4 flex justify-center">
          <NPagination
            v-model:page="queryParams.pageNum"
            :page-count="orders.pages"
            :page-size="queryParams.pageSize"
            @update:page="fetchOrders"
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
