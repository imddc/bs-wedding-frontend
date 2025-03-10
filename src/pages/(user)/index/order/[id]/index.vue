<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NCard, NDescriptions, NDescriptionsItem, NSpin, NStep, NSteps, NTag } from 'naive-ui'
import { ArrowLeft, Building2, Package, User } from 'lucide-vue-next'
import { getOrderDetail , updateOrderStatus } from '~/api/order'
import { getHostProduct, getHotelProduct, getPhotographyProduct, getProduct } from '~/api/product'
import type { OrdersDetailResponse } from '~/api/order/type'
import type { HostProduct, HotelProduct, PhotographyProduct, Product } from '~/api/product/type'
import type { MerchantInfo } from '~/api/merchant/type'
import { getMerchantById } from '~/api/merchant'
import { MerchantType } from '~/api/merchant/type'
import { ORDER_STATUS, ORDER_STATUS_DESC } from '~/constants/order'

const route = useRoute()
const router = useRouter()
const orderId = Number(route.params.id)

// 加载状态
const loading = ref(true)

// 订单信息
const orderInfo = ref<OrdersDetailResponse>()
// 商家信息
const merchantInfo = ref<MerchantInfo>()
// 产品信息
const productInfo = ref<Product | HotelProduct | PhotographyProduct | HostProduct>()

// 获取订单状态标签类型
function getStatusType(status: number) {
  const typeMap: Record<number, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    0: 'warning', // 待支付
    1: 'info', // 已支付
    2: 'success', // 已完成
    3: 'error', // 已取消
  }
  return typeMap[status] || 'default'
}

// 获取产品详情
async function fetchProductDetail(productId: number, merchantType: MerchantType) {
  try {
    let response
    switch (merchantType) {
      case MerchantType.HOTEL:
        response = await getHotelProduct(productId)
        break
      case MerchantType.PHOTOGRAPHY:
        response = await getPhotographyProduct(productId)
        break
      case MerchantType.HOST:
        response = await getHostProduct(productId)
        break
      default:
        response = await getProduct(productId)
    }
    if (response.code === 200)
      productInfo.value = response.data
  } catch (error) {
    window.$message.error('获取产品信息失败')
    console.error(error)
  }
}

// 获取订单详情及相关信息
async function fetchOrderDetail() {
  loading.value = true
  try {
    // 获取订单详情
    const orderResponse = await getOrderDetail(orderId)
    if (orderResponse.code === 200) {
      orderInfo.value = orderResponse.data

      // 获取商家信息
      const merchantResponse = await getMerchantById(orderInfo.value.merchantId)
      if (merchantResponse.code === 200) {
        merchantInfo.value = merchantResponse.data
        // 获取产品详情
        await fetchProductDetail(orderInfo.value.productId, merchantInfo.value.merchantType)
      }
    }
  } catch (error) {
    window.$message.error('获取订单详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 返回列表
function goBack() {
  router.push('/order')
}

onMounted(() => {
  fetchOrderDetail()
})

async function cancleOrder() {
  try {
    await updateOrderStatus({
    id: orderId,
    orderStatus: 3
  })
  window.$message.success('订单已取消')
  await fetchOrderDetail()

  } catch {
    window.$message.success('订单取消失败，请重试')
  }
}
</script>

<template>
  <div class="order-detail-container">
    <div class="container mx-auto px-4 py-6">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <NButton
          text
          class="flex items-center text-gray-600 hover:text-primary"
          @click="goBack"
        >
          <ArrowLeft class="mr-1" :size="16" />
          返回订单列表
        </NButton>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <NSpin size="large" />
      </div>
      <template v-else>
        <!-- 订单状态卡片 -->
        <NCard class="mb-6" :bordered="false">
          <div class="flex items-center justify-between mb-6">
            <div>
              <div class="flex gap-4 items-center">
                <h1 class="text-2xl font-bold mb-2">
                  订单详情
                </h1>
                <NButton v-if="orderInfo?.orderStatus !== 3" size="tiny" @click="cancleOrder">
                  取消订单
                </NButton>
              </div>
              
              <div class="flex items-center text-gray-500">
                <span class="mr-2">订单号：{{ orderInfo?.orderNo }}</span>
                <NTag :type="getStatusType(orderInfo?.orderStatus || 0)">
                  {{ orderInfo?.orderStatusDesc }}
                </NTag>
              </div>
            </div>
          </div>

          <!-- 订单进度 -->
          <NSteps
            :current="orderInfo?.orderStatus === 3 ? -1 : orderInfo?.orderStatus || 0"
            :status="orderInfo?.orderStatus === 3 ? 'error' : undefined"
          >
            <NStep
              v-for="step in ORDER_STATUS"
              :key="step"
              :title="ORDER_STATUS_DESC[step]"
              :status="step === orderInfo?.orderStatus ? 'finish' : undefined"
            />
          </NSteps>
        </NCard>

        <!-- 商家信息 -->
        <NCard class="mb-6" :bordered="false">
          <div class="flex items-center mb-4">
            <Building2 class="mr-2 text-primary" />
            <h2 class="text-lg font-bold">
              商家信息
            </h2>
          </div>
          <NDescriptions bordered>
            <NDescriptionsItem label="商家名称">
              {{ merchantInfo?.merchantName }}
            </NDescriptionsItem>
            <NDescriptionsItem label="商家类型">
              {{ merchantInfo?.merchantTypeName }}
            </NDescriptionsItem>
            <NDescriptionsItem label="联系人">
              {{ merchantInfo?.contactPerson }}
            </NDescriptionsItem>
            <NDescriptionsItem label="联系电话">
              {{ merchantInfo?.contactPhone }}
            </NDescriptionsItem>
            <NDescriptionsItem label="地址">
              {{ merchantInfo?.address }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- 产品信息 -->
        <NCard class="mb-6" :bordered="false">
          <div class="flex items-center mb-4">
            <Package class="mr-2 text-primary" />
            <h2 class="text-lg font-bold">
              产品信息
            </h2>
          </div>
          <NDescriptions bordered>
            <NDescriptionsItem label="产品名称">
              {{ productInfo?.productName }}
            </NDescriptionsItem>
            <NDescriptionsItem label="产品类型">
              {{ productInfo?.productTypeName }}
            </NDescriptionsItem>
            <NDescriptionsItem label="价格">
              ¥{{ productInfo?.price?.toLocaleString() }}
            </NDescriptionsItem>
            <NDescriptionsItem label="评分">
              {{ productInfo?.rating }}
            </NDescriptionsItem>
            <NDescriptionsItem label="描述">
              {{ productInfo?.description || '暂无描述' }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- 订单信息 -->
        <NCard :bordered="false">
          <div class="flex items-center mb-4">
            <User class="mr-2 text-primary" />
            <h2 class="text-lg font-bold">
              订单信息
            </h2>
          </div>
          <NDescriptions bordered>
            <NDescriptionsItem label="订单编号">
              {{ orderInfo?.orderNo }}
            </NDescriptionsItem>
            <NDescriptionsItem label="下单时间">
              {{ orderInfo?.createTime }}
            </NDescriptionsItem>
            <NDescriptionsItem label="婚礼日期">
              {{ orderInfo?.weddingDate || '未设置' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="备注">
              {{ orderInfo?.remark || '无' }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
      </template>
    </div>
  </div>
</template>

<style scoped>
.order-detail-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}
</style>
