<!-- src/views/MerchantList.vue -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NInput, NPagination, NSelect, NSpin } from 'naive-ui'
import { Camera, Heart, Image, MapPin, Users } from 'lucide-vue-next'
import {
  pageMerchants,
} from '~/api/merchant'
import {

  MerchantStatus,
  MerchantType,
} from '~/api/merchant/type'
import type { MerchantPageResult, MerchantQueryParams } from '~/api/merchant/type'

const router = useRouter()

// 商家列表数据
const merchants = ref<MerchantPageResult>({
  records: [],
  total: 0,
  size: 10,
  current: 1,
  pages: 0,
})

// 加载状态
const loading = ref(false)

// 查询参数
const queryParams = reactive<MerchantQueryParams>({
  merchantType: undefined, // 默认展示全部商家
  pageNum: 1,
  pageSize: 8,
  status: MerchantStatus.ONLINE, // 默认只展示上架的商家
})

// 商家类型选项
const merchantTypeOptions = [
  { label: '全部商家', value: undefined },
  { label: '婚纱摄影', value: MerchantType.PHOTOGRAPHY },
  { label: '婚宴酒店', value: MerchantType.HOTEL },
  { label: '司仪主持', value: MerchantType.HOST },
]

// 城市选项
const cityOptions = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
]

// 获取商家类型名称
function getMerchantTypeName(type: MerchantType): string {
  if (type === undefined)
    return '全部商家'
  const option = merchantTypeOptions.find(option => option.value === type)
  return option ? option.label : '未知'
}

// 获取商家列表
async function fetchMerchants() {
  loading.value = true
  try {
    const response = await pageMerchants(queryParams)
    if (response.success) {
      merchants.value = response.data
    } else {
      window.$message.error('获取商家列表失败')
    }
  } catch (error) {
    window.$message.error('获取商家列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  queryParams.pageNum = 1
  fetchMerchants()
}

// 重置
function handleReset() {
  queryParams.merchantName = undefined
  queryParams.city = undefined
  queryParams.pageNum = 1
  fetchMerchants()
}

// 查看商家详情
function viewDetails(id: number) {
  router.push(`/merchant/${id}`)
}

// 商家类型图标
function getMerchantIcon(type: MerchantType) {
  if (type === undefined)
    return Heart
  switch (type) {
    case MerchantType.PHOTOGRAPHY:
      return Camera
    case MerchantType.HOTEL:
      return MapPin
    case MerchantType.HOST:
      return Users
    default:
      return Image
  }
}

onMounted(() => {
  fetchMerchants()
})
</script>

<template>
  <div class="merchant-list-container">
    <!-- 头部横幅 -->
    <div
      class="banner relative h-64 bg-gradient-to-r from-red-800 to-red-600 mb-8 overflow-hidden rounded-lg"
    >
      <div class="container mx-auto px-4 h-full flex flex-col justify-center z-10 relative">
        <h1 class="text-4xl font-bold text-white mb-2">
          {{ getMerchantTypeName(queryParams.merchantType || MerchantType.PHOTOGRAPHY) }} · 商家精选
        </h1>
        <p class="text-xl text-white opacity-90">
          臻选优质服务商家，定制您的完美婚礼
        </p>
      </div>
      <div class="absolute right-0 bottom-0 opacity-20">
        <component
          :is="getMerchantIcon(queryParams.merchantType || MerchantType.PHOTOGRAPHY)"
          :size="160"
          color="white"
        />
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- 筛选和列表部分 -->
      <div class="flex flex-wrap md:flex-nowrap gap-6">
        <!-- 筛选侧边栏 -->
        <div class="w-full md:w-1/4 lg:w-1/5">
          <div class="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
            <h3 class="text-lg font-bold mb-4 pb-2 border-b border-red-100">
              筛选条件
            </h3>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">商家类型</label>
              <NSelect
                v-model:value="queryParams.merchantType"
                placeholder="选择商家类型"
                :options="merchantTypeOptions"
                @update:value="handleSearch"
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">商家名称</label>
              <NInput
                v-model:value="queryParams.merchantName"
                placeholder="请输入商家名称"
                clearable
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">所在城市</label>
              <NSelect
                v-model:value="queryParams.city"
                filterable
                clearable
                placeholder="选择城市"
                :options="cityOptions"
              />
            </div>

            <div class="flex items-center gap-2 pt-2">
              <NButton
                type="primary"
                color="#B91C1C"
                :loading="loading"
                @click="handleSearch"
              >
                搜索
              </NButton>
              <NButton type="default" @click="handleReset">
                重置
              </NButton>
            </div>
          </div>
        </div>

        <!-- 列表内容 -->
        <div class="w-full md:w-3/4 lg:w-4/5">
          <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div class="flex justify-between items-center mb-4">
              <div class="text-lg font-bold">
                {{ getMerchantTypeName(queryParams.merchantType || MerchantType.PHOTOGRAPHY) }}商家列表
              </div>
            </div>

            <div v-if="loading" class="py-8 flex justify-center">
              <NSpin size="large" />
            </div>
            <div v-else-if="merchants.records.length === 0" class="text-center py-8 text-gray-500">
              暂无商家，请调整筛选条件
            </div>
            <div v-else>
              <!-- 使用网格布局 -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="merchant in merchants.records"
                  :key="merchant.id"
                  class="merchant-card bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition hover:border-red-300"
                >
                  <div class="relative h-48 overflow-hidden">
                    <img
                      v-if="merchant.logo"
                      :src="merchant.logo"
                      :alt="merchant.merchantName"
                      class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    >
                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                      <component
                        :is="getMerchantIcon(merchant.merchantType)"
                        class="text-gray-400"
                        :size="48"
                      />
                    </div>
                    <div
                      class="absolute top-2 right-2 px-2 py-1 rounded-full text-white text-sm"
                      :class="merchant.status === MerchantStatus.ONLINE ? 'bg-green-600' : 'bg-gray-500'"
                    >
                      {{ merchant.status === MerchantStatus.ONLINE ? '营业中' : '已下架' }}
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="text-lg font-bold mb-1 line-clamp-1">
                      {{ merchant.merchantName }}
                    </h3>
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin :size="14" class="mr-1" />
                      <span>{{ merchant.city || '未知' }}</span>
                      <div class="flex items-center ml-auto">
                        <Heart class="text-red-400 mr-1" :size="16" />
                        <span>{{ merchant.favoriteCount }}</span>
                      </div>
                    </div>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
                      {{ merchant.description || '暂无描述' }}
                    </p>
                    <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div class="text-gray-500 text-sm">
                        {{ merchant.merchantTypeName }}
                      </div>
                      <NButton
                        size="small"
                        type="primary"
                        color="#B91C1C"
                        @click="viewDetails(merchant.id)"
                      >
                        查看详情
                      </NButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div v-if="merchants.records.length > 0" class="mt-4 flex justify-center">
              <NPagination
                v-model:page="merchants.current"
                :page-count="merchants.pages"
                :page-size="merchants.size"
                @update:page="(page) => {
                  queryParams.pageNum = page
                  fetchMerchants()
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.merchant-list-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}

/* 中国风细节 */
.banner h1 {
  font-family: 'STZhongsong', 'SimSun', serif;
}

.merchant-card {
  transition: all 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .banner {
    height: 12rem;
  }

  .banner h1 {
    font-size: 1.75rem;
  }

  .banner p {
    font-size: 1rem;
  }
}

/* 添加中国风元素 */
.merchant-card:hover::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #b91c1c, #fecaca, #b91c1c);
}
</style>
