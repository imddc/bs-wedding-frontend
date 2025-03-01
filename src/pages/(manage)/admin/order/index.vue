<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import { NButton, NCard, NDataTable, NDatePicker, NForm, NFormItem, NInput, NPopconfirm, NSelect, NSpace, NTag } from 'naive-ui'
import { RefreshCw, Search, Trash2 } from 'lucide-vue-next'
import { deleteOrder, getOrdersPage, updateOrderStatus } from '~/api/order'
import type { OrdersDetailResponse, OrdersPageResponse, OrdersQueryParams } from '~/api/order/type'
import { ORDER_STATUS, ORDER_STATUS_DESCRIPTIONS, ORDER_STATUS_TAG_TYPES } from '~/constants/order'
import { formatDate } from '~/utils/core'

const loading = ref(false)
const orders = ref<OrdersDetailResponse[]>([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange: (page: number) => {
    pagination.page = page
    loadOrders()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadOrders()
  },
})

const searchForm = reactive<OrdersQueryParams>({
  userId: undefined,
  merchantId: undefined,
  productId: undefined,
  orderStatus: undefined,
  weddingDateStart: undefined,
  weddingDateEnd: undefined,
  pageNum: 1,
  pageSize: 10,
})

const columns = [
  { title: '订单编号', key: 'orderNo' },
  { title: '用户ID', key: 'userId' },
  { title: '商家ID', key: 'merchantId' },
  { title: '商品ID', key: 'productId' },
  {
    title: '婚礼日期',
    key: 'weddingDate',
    render: (row: OrdersDetailResponse) => {
      return row.weddingDate ? formatDate(row.weddingDate) : '暂未设置'
    },
  },
  {
    title: '订单状态',
    key: 'orderStatus',
    render: (row: OrdersDetailResponse) => {
      const type = ORDER_STATUS_TAG_TYPES[row.orderStatus] || 'default'
      return h(NTag, { type }, { default: () => row.orderStatusDesc })
    },
  },
  { title: '创建时间', key: 'createTime' },
  {
    title: '操作',
    key: 'actions',
    render: (row: OrdersDetailResponse) => {
      return h(
        NSpace,
        { align: 'center' },
        {
          default: () => [
            // 移除了编辑按钮，因为订单只能修改状态
            row.orderStatus === ORDER_STATUS.PENDING_PAYMENT
              ? h(
                  NButton,
                  {
                    size: 'small',
                    type: 'success',
                    onClick: () => changeOrderStatus(row.id, ORDER_STATUS.PAID),
                  },
                  { default: () => '标记已支付' },
                )
              : null,
            row.orderStatus === ORDER_STATUS.PAID
              ? h(
                  NButton,
                  {
                    size: 'small',
                    type: 'success',
                    onClick: () => changeOrderStatus(row.id, ORDER_STATUS.COMPLETED),
                  },
                  { default: () => '标记已完成' },
                )
              : null,
            row.orderStatus !== ORDER_STATUS.CANCELLED && row.orderStatus !== ORDER_STATUS.COMPLETED
              ? h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error',
                    onClick: () => changeOrderStatus(row.id, ORDER_STATUS.CANCELLED),
                  },
                  { default: () => '取消' },
                )
              : null,
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteOrder(row.id),
              },
              {
                default: () => '确认删除该订单吗？',
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      type: 'error',
                    },
                    { default: () => '删除', icon: () => h(Trash2) },
                  ),
              },
            ),
          ],
        },
      )
    },
  },
]

const statusOptions = [
  { label: '全部状态', value: null },
  { label: '待支付', value: ORDER_STATUS.PENDING_PAYMENT },
  { label: '已支付', value: ORDER_STATUS.PAID },
  { label: '已完成', value: ORDER_STATUS.COMPLETED },
  { label: '已取消', value: ORDER_STATUS.CANCELLED },
]

onMounted(() => {
  loadOrders()
})

async function loadOrders() {
  try {
    loading.value = true

    // 构建查询参数
    const params: OrdersQueryParams = {
      ...searchForm,
      pageNum: pagination.page,
      pageSize: pagination.pageSize,
    }

    // 发送请求
    const response = await getOrdersPage(params)

    if (response.success) {
      const data: OrdersPageResponse = response.data
      orders.value = data.records
      pagination.itemCount = data.total
    } else {
      window.$message.error(response.message || '获取订单列表失败')
    }
  } catch (error) {
    console.error('获取订单列表出错:', error)
    window.$message.error('获取订单列表出错')
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = undefined
  })
  pagination.page = 1
  loadOrders()
}

function handleSearch() {
  pagination.page = 1
  loadOrders()
}

async function handleDeleteOrder(id: number) {
  try {
    const response = await deleteOrder(id)
    if (response.success) {
      window.$message.success('删除订单成功')
      loadOrders()
    } else {
      window.$message.error(response.message || '删除订单失败')
    }
  } catch (error) {
    console.error('删除订单出错:', error)
    window.$message.error('删除订单出错')
  }
}

async function changeOrderStatus(id: number, status: number) {
  try {
    const response = await updateOrderStatus({ id, orderStatus: status })
    if (response.success) {
      window.$message.success(`订单状态更新为${ORDER_STATUS_DESCRIPTIONS[status]}`)
      loadOrders()
    } else {
      window.$message.error(response.message || '更新订单状态失败')
    }
  } catch (error) {
    console.error('更新订单状态出错:', error)
    window.$message.error('更新订单状态出错')
  }
}
</script>

<template>
  <div class="order-list">
    <NCard title="订单管理" class="mb-4">
      <NForm :label-width="80" :model="searchForm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NFormItem label="用户ID">
            <NInput v-model:value="searchForm.userId" placeholder="请输入用户ID" />
          </NFormItem>
          <NFormItem label="商家ID">
            <NInput v-model:value="searchForm.merchantId" placeholder="请输入商家ID" />
          </NFormItem>
          <NFormItem label="商品ID">
            <NInput v-model:value="searchForm.productId" placeholder="请输入商品ID" />
          </NFormItem>
          <NFormItem label="订单状态">
            <NSelect
              v-model:value="searchForm.orderStatus"
              :options="statusOptions"
              placeholder="请选择订单状态"
              class="w-full"
            />
          </NFormItem>
        </div>
        <div class="w-full flex justify-end mt-6">
          <NButton type="primary" class="mr-2" @click="handleSearch">
            <template #icon>
              <Search />
            </template>
            搜索
          </NButton>
          <NButton @click="resetSearch">
            <template #icon>
              <RefreshCw />
            </template>
            重置
          </NButton>
        </div>
      </NForm>
    </NCard>

    <NCard>
      <NDataTable
        :columns="columns"
        :data="orders"
        :loading="loading"
        :pagination="pagination"
        :bordered="false"
        striped
      />
    </NCard>
  </div>
</template>

<style scoped>
.order-list {
  width: 100%;
}
</style>
