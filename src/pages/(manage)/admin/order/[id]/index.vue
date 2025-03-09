<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NEmpty,
  NSpace,
  NSpin,
  NTag,
} from 'naive-ui'
import {
  Calendar,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Store,
  User,
} from 'lucide-vue-next'
import type { Type } from 'naive-ui/es/button/src/interface'
import { getOrderDetail, updateOrderStatus } from '~/api/order'
import { getUserById } from '~/api/user'
import { getProduct } from '~/api/product'
import type { OrdersDetailResponse, OrdersStatusUpdateParams } from '~/api/order/type'
import type { UserInfo } from '~/api/user/type'
import type { Product } from '~/api/product/type'
import { handleImgUrl } from '~/utils/core'

const route = useRoute()
const router = useRouter()
const orderId = Number(route.params.id)

const loading = ref(true)
const orderDetail = ref<OrdersDetailResponse | null>(null)
const buyer = ref<UserInfo | null>(null)
const merchant = ref<UserInfo | null>(null)
const product = ref<Product | null>(null)

// 订单状态样式映射
const statusTypeMap = {
  0: 'warning', // 待付款
  1: 'info', // 已付款
  2: 'processing', // 已发货
  3: 'success', // 已完成
  4: 'error', // 已取消
}

// 订单操作按钮
const statusActions = computed(() => {
  if (!orderDetail.value)
    return []

  const status = orderDetail.value.orderStatus
  const actions = []

  if (status === 0) { // 待付款状态
    actions.push({
      label: '标记为已付款',
      status: 1,
      type: 'primary',
    })
    actions.push({
      label: '取消订单',
      status: 4,
      type: 'error',
    })
  } else if (status === 1) { // 已付款状态
    actions.push({
      label: '标记为已发货',
      status: 2,
      type: 'primary',
    })
    actions.push({
      label: '取消订单',
      status: 4,
      type: 'error',
    })
  } else if (status === 2) { // 已发货状态
    actions.push({
      label: '标记为已完成',
      status: 3,
      type: 'primary',
    })
  }

  return actions
})

// 获取订单详情
async function fetchOrderDetail() {
  loading.value = true
  try {
    const res = await getOrderDetail(orderId)
    if (res.success) {
      orderDetail.value = res.data
      await Promise.all([
        fetchUserInfo(),
        fetchProductInfo(),
      ])
    } else {
      window.$message.error('获取订单详情失败')
    }
  } catch (error) {
    console.error('获取订单详情错误:', error)
    window.$message.error('获取订单详情出错')
  } finally {
    loading.value = false
  }
}

// 获取用户和商家信息
async function fetchUserInfo() {
  if (!orderDetail.value)
    return

  try {
    // 获取买家信息
    const buyerRes = await getUserById(orderDetail.value.userId)
    if (buyerRes.success) {
      buyer.value = buyerRes.data
    }

    // 获取商家信息
    const merchantRes = await getUserById(orderDetail.value.merchantId)
    if (merchantRes.success) {
      merchant.value = merchantRes.data
    }
  } catch (error) {
    console.error('获取用户信息错误:', error)
    window.$message.error('获取用户信息出错')
  }
}

// 获取产品信息
async function fetchProductInfo() {
  if (!orderDetail.value)
    return

  try {
    const res = await getProduct(orderDetail.value.productId)
    if (res.success) {
      product.value = res.data
    }
  } catch (error) {
    console.error('获取产品信息错误:', error)
    window.$message.error('获取产品信息出错')
  }
}

// 更新订单状态
async function handleUpdateStatus(status: number) {
  try {
    const params: OrdersStatusUpdateParams = {
      id: orderId,
      orderStatus: status,
    }

    const res = await updateOrderStatus(params)
    if (res.success) {
      window.$message.success('订单状态更新成功')
      await fetchOrderDetail()
    } else {
      window.$message.error('订单状态更新失败')
    }
  } catch (error) {
    console.error('更新订单状态错误:', error)
    window.$message.error('更新订单状态出错')
  }
}

// 返回订单列表
function handleBack() {
  router.push('/admin/order')
}

onMounted(fetchOrderDetail)
</script>

<template>
  <div class="p-4 md:p-6">
    <div class="mb-6 flex justify-end">
      <NButton @click="handleBack">
        返回列表
      </NButton>
    </div>

    <NSpin :show="loading">
      <template v-if="orderDetail">
        <!-- 订单基本信息 -->
        <NCard title="订单基本信息" class="mb-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div class="text-xl font-medium">
              订单号: {{ orderDetail.orderNo }}
            </div>
            <NTag :type="statusTypeMap[orderDetail.orderStatus]" size="large">
              {{ orderDetail.orderStatusDesc }}
            </NTag>
          </div>

          <NDescriptions :column="1" label-placement="left" bordered>
            <NDescriptionsItem label="下单时间">
              <div class="flex items-center">
                <Calendar class="w-4 h-4 mr-2" />
                {{ orderDetail.createTime }}
              </div>
            </NDescriptionsItem>

            <NDescriptionsItem v-if="orderDetail.weddingDate" label="婚礼日期">
              <div class="flex items-center">
                <Calendar class="w-4 h-4 mr-2" />
                {{ orderDetail.weddingDate }}
              </div>
            </NDescriptionsItem>

            <NDescriptionsItem v-if="orderDetail.remark" label="备注信息">
              <div class="flex items-center">
                <FileText class="w-4 h-4 mr-2" />
                {{ orderDetail.remark }}
              </div>
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- 商品信息 -->
        <NCard title="商品信息" class="mb-4">
          <NSpin :show="!product">
            <template v-if="product">
              <div class="flex flex-col md:flex-row">
                <div class="w-full md:w-1/4 mb-4 md:mb-0">
                  <img
                    v-if="product.mainImage"
                    :src="handleImgUrl(product.mainImage)"
                    :alt="product.productName"
                    class="w-full h-auto rounded object-cover"
                  >
                  <div v-else class="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                    暂无图片
                  </div>
                </div>

                <div class="w-full md:w-3/4 md:pl-6">
                  <NDescriptions :column="1" label-placement="left" bordered>
                    <NDescriptionsItem label="商品名称">
                      <div class="flex items-center">
                        <ShoppingCart class="w-4 h-4 mr-2" />
                        {{ product.productName }}
                      </div>
                    </NDescriptionsItem>

                    <NDescriptionsItem label="价格">
                      <div class="text-red-500 font-medium">
                        ¥{{ product.price.toFixed(2) }}
                      </div>
                    </NDescriptionsItem>

                    <NDescriptionsItem label="商品类型">
                      {{ product.productTypeName }}
                    </NDescriptionsItem>

                    <NDescriptionsItem label="商品分类">
                      {{ product.categoryName }}
                    </NDescriptionsItem>

                    <NDescriptionsItem v-if="product.location" label="商品位置">
                      <div class="flex items-center">
                        <MapPin class="w-4 h-4 mr-2" />
                        {{ product.location }}
                      </div>
                    </NDescriptionsItem>

                    <NDescriptionsItem v-if="product.description" label="商品描述">
                      {{ product.description }}
                    </NDescriptionsItem>
                  </NDescriptions>
                </div>
              </div>
            </template>
            <NEmpty v-else description="暂无商品信息" />
          </NSpin>
        </NCard>

        <!-- 用户信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- 买家信息 -->
          <NCard title="买家信息">
            <NSpin :show="!buyer">
              <template v-if="buyer">
                <NDescriptions :column="1" label-placement="left" bordered>
                  <NDescriptionsItem label="用户名">
                    <div class="flex items-center">
                      <User class="w-4 h-4 mr-2" />
                      {{ buyer.username }}
                    </div>
                  </NDescriptionsItem>

                  <NDescriptionsItem v-if="buyer.realName" label="真实姓名">
                    {{ buyer.realName }}
                  </NDescriptionsItem>

                  <NDescriptionsItem v-if="buyer.phone" label="电话">
                    <div class="flex items-center">
                      <Phone class="w-4 h-4 mr-2" />
                      {{ buyer.phone }}
                    </div>
                  </NDescriptionsItem>

                  <NDescriptionsItem v-if="buyer.email" label="邮箱">
                    <div class="flex items-center">
                      <Mail class="w-4 h-4 mr-2" />
                      {{ buyer.email }}
                    </div>
                  </NDescriptionsItem>
                </NDescriptions>
              </template>
              <NEmpty v-else description="暂无买家信息" />
            </NSpin>
          </NCard>

          <!-- 商家信息 -->
          <NCard title="商家信息">
            <NSpin :show="!merchant">
              <template v-if="merchant">
                <NDescriptions :column="1" label-placement="left" bordered>
                  <NDescriptionsItem label="商家名称">
                    <div class="flex items-center">
                      <Store class="w-4 h-4 mr-2" />
                      {{ merchant.username }}
                    </div>
                  </NDescriptionsItem>

                  <NDescriptionsItem v-if="merchant.realName" label="联系人">
                    {{ merchant.realName }}
                  </NDescriptionsItem>

                  <NDescriptionsItem v-if="merchant.phone" label="联系电话">
                    <div class="flex items-center">
                      <Phone class="w-4 h-4 mr-2" />
                      {{ merchant.phone }}
                    </div>
                  </NDescriptionsItem>

                  <NDescriptionsItem v-if="merchant.email" label="联系邮箱">
                    <div class="flex items-center">
                      <Mail class="w-4 h-4 mr-2" />
                      {{ merchant.email }}
                    </div>
                  </NDescriptionsItem>
                </NDescriptions>
              </template>
              <NEmpty v-else description="暂无商家信息" />
            </NSpin>
          </NCard>
        </div>

        <!-- 订单操作 -->
        <NCard v-if="statusActions.length > 0" title="订单操作">
          <NSpace>
            <NButton
              v-for="action in statusActions"
              :key="action.status"
              :type="action.type as Type"
              @click="handleUpdateStatus(action.status)"
            >
              {{ action.label }}
            </NButton>
          </NSpace>
        </NCard>
      </template>

      <NEmpty v-else-if="!loading" description="未找到订单信息" />
    </NSpin>
  </div>
</template>
