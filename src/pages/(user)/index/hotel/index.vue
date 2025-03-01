<!-- src/views/HotelList.vue -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NInput, NInputNumber, NPagination, NRate, NSelect, NSpin } from 'naive-ui'
import { Hotel, Image, MapPin, Maximize2, Star, Users, Utensils } from 'lucide-vue-next'
import {
  getHotHotelProducts,
  getProducts,
} from '~/api/product'
import type {
  HotelProduct,
  HotProduct,
  HotProductQueryParams,
  PageResult,
  ProductQueryParams,
} from '~/api/product/type'

const router = useRouter()

// 商品列表数据
const products = ref<PageResult<HotelProduct>>({
  total: 0,
  list: [],
  pageNum: 1,
  pageSize: 10,
  pages: 0,
})

// 热门商品
const hotProducts = ref<HotProduct[]>([])

// 加载状态
const loading = ref(false)
const hotLoading = ref(false)

// 桌数范围
const tableRange = reactive({
  min: undefined as number | undefined,
  max: undefined as number | undefined,
})

// 查询参数
const queryParams = reactive<ProductQueryParams>({
  productType: 2, // 假设2为酒店商品
  pageNum: 1,
  pageSize: 8,
  orderBy: 'rating_desc',
})

// 筛选器选项
const locationOptions = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
]

const sortOptions = [
  { label: '评分高到低', value: 'rating_desc' },
  { label: '价格高到低', value: 'price_desc' },
  { label: '价格低到高', value: 'price_asc' },
  { label: '销量高到低', value: 'sales_desc' },
  { label: '最新上架', value: 'createTime_desc' },
]

// 获取商品列表
async function fetchProducts() {
  loading.value = true

  // 处理桌数筛选
  if (tableRange.min !== undefined || tableRange.max !== undefined) {
    const tagValues = []
    if (tableRange.min !== undefined)
      tagValues.push(`minTables:${tableRange.min}`)
    if (tableRange.max !== undefined)
      tagValues.push(`maxTables:${tableRange.max}`)
    queryParams.tags = tagValues.join(',')
  }

  try {
    const response = await getProducts(queryParams)
    if (response.success) {
      products.value = response.data
    } else {
      window.$message.error('获取酒店列表失败')
    }
  } catch (error) {
    window.$message.error('获取酒店列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 获取热门商品
async function fetchHotProducts() {
  hotLoading.value = true
  try {
    const hotParams: HotProductQueryParams = {
      productType: 2,
      limit: 3,
    }
    const response = await getHotHotelProducts(hotParams)
    if (response.success) {
      hotProducts.value = response.data
    } else {
      window.$message.error('获取推荐酒店失败')
    }
  } catch (error) {
    window.$message.error('获取推荐酒店失败')
    console.error(error)
  } finally {
    hotLoading.value = false
  }
}

// 搜索
function handleSearch() {
  queryParams.pageNum = 1
  fetchProducts()
}

// 重置
function handleReset() {
  queryParams.productName = undefined
  queryParams.minPrice = undefined
  queryParams.maxPrice = undefined
  queryParams.minRating = undefined
  queryParams.location = undefined
  queryParams.tags = undefined
  tableRange.min = undefined
  tableRange.max = undefined
  queryParams.pageNum = 1
  queryParams.orderBy = 'rating_desc'
  fetchProducts()
}

// 查看商品详情
function viewDetails(id: number) {
  router.push(`/hotel/${id}`)
}

onMounted(() => {
  fetchProducts()
  fetchHotProducts()
})
</script>

<template>
  <div class="hotel-list-container">
    <!-- 头部横幅 -->
    <div
      class="banner relative h-64 bg-gradient-to-r from-amber-700 to-amber-500 mb-8 overflow-hidden rounded-lg"
    >
      <div class="container mx-auto px-4 h-full flex flex-col justify-center z-10 relative">
        <h1 class="text-4xl font-bold text-white mb-2">
          良辰美景 · 婚宴酒店
        </h1>
        <p class="text-xl text-white opacity-90">
          专属定制，华美盛宴
        </p>
      </div>
      <div class="absolute right-0 bottom-0 opacity-20">
        <Hotel :size="160" color="white" />
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- 热门推荐部分，使用水平卡片样式 -->
      <div class="mb-12">
        <div class="flex items-center mb-4">
          <div class="w-1 h-6 bg-amber-600 mr-3" />
          <h2 class="text-2xl font-bold text-gray-800">
            精选场地
          </h2>
        </div>
        <div v-if="hotLoading" class="py-8 flex justify-center">
          <NSpin size="large" />
        </div>
        <div v-else-if="hotProducts.length === 0" class="text-center py-8 text-gray-500">
          暂无推荐场地
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in hotProducts"
            :key="product.id"
            class="bg-white rounded-lg overflow-hidden shadow-md border border-amber-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div class="relative h-48 overflow-hidden">
              <img
                v-if="product.mainImage"
                :src="product.mainImage"
                :alt="product.productName"
                class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              >
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <Image class="text-gray-400" :size="48" />
              </div>
              <div
                class="absolute top-2 right-2 px-2 py-1 rounded-full bg-amber-600 text-white text-sm"
              >
                推荐
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-bold mb-1 line-clamp-1">
                {{ product.productName }}
              </h3>
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <MapPin :size="14" class="mr-1" />
                <span>{{ product.location || '未知' }}</span>
                <div class="flex items-center ml-auto">
                  <Star class="text-yellow-400 mr-1" :size="16" />
                  <span>{{ product.rating }}</span>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ product.description || '暂无描述' }}
              </p>
              <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                <div class="text-amber-600 font-bold">
                  ￥{{ product.price.toLocaleString() }}
                </div>
                <NButton
                  size="small"
                  type="warning"
                  class="bg-amber-600 text-white"
                  @click="viewDetails(product.id)"
                >
                  预约看场
                </NButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选和列表部分 -->
      <div class="flex flex-wrap md:flex-nowrap gap-6">
        <!-- 筛选侧边栏 -->
        <div class="w-full md:w-1/4 lg:w-1/5">
          <div class="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
            <h3 class="text-lg font-bold mb-4 pb-2 border-b border-amber-100">
              筛选条件
            </h3>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">酒店名称</label>
              <NInput
                v-model:value="queryParams.productName"
                placeholder="请输入酒店名称"
                clearable
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">价格范围</label>
              <div class="flex items-center">
                <NInputNumber
                  v-model:value="queryParams.minPrice"
                  placeholder="最低价"
                  :min="0"
                  clearable
                  class="flex-1"
                />
                <span class="mx-2">-</span>
                <NInputNumber
                  v-model:value="queryParams.maxPrice"
                  placeholder="最高价"
                  :min="0"
                  clearable
                  class="flex-1"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">最低评分</label>
              <NRate
                v-model:value="queryParams.minRating"
                allow-half
                class="flex justify-start"
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">地区</label>
              <NSelect
                v-model:value="queryParams.location"
                filterable
                clearable
                placeholder="选择地区"
                :options="locationOptions"
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">桌数范围</label>
              <div class="flex items-center">
                <NInputNumber
                  v-model:value="tableRange.min"
                  placeholder="最少桌数"
                  :min="0"
                  clearable
                  class="flex-1"
                />
                <span class="mx-2">-</span>
                <NInputNumber
                  v-model:value="tableRange.max"
                  placeholder="最多桌数"
                  :min="0"
                  clearable
                  class="flex-1"
                />
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2">
              <NButton
                type="primary"
                color="#4F46E5"
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
                婚宴酒店列表
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">排序：</span>
                <NSelect
                  v-model:value="queryParams.orderBy"
                  size="small"
                  :options="sortOptions"
                  style="width: 120px"
                />
              </div>
            </div>

            <div v-if="loading" class="py-8 flex justify-center">
              <NSpin size="large" />
            </div>
            <div v-else-if="products.list.length === 0" class="text-center py-8 text-gray-500">
              暂无酒店，请调整筛选条件
            </div>
            <div v-else>
              <!-- 使用列表样式 -->
              <div class="space-y-4">
                <div
                  v-for="product in products.list"
                  :key="product.id"
                  class="hotel-card flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <div class="md:w-1/3 h-48 md:h-auto overflow-hidden relative">
                    <img
                      v-if="product.mainImage"
                      :src="product.mainImage"
                      :alt="product.productName"
                      class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    >
                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Image class="text-gray-300" :size="48" />
                    </div>
                    <div
                      v-if="product.sales > 100"
                      class="absolute top-2 left-2 px-2 py-1 rounded bg-amber-500 text-white text-xs"
                    >
                      热门
                    </div>
                  </div>
                  <div class="md:w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <div class="flex justify-between items-start">
                        <h3 class="text-lg font-bold mb-1">
                          {{ product.productName }}
                        </h3>
                        <div class="flex items-center">
                          <Star class="text-yellow-400 mr-1" :size="16" />
                          <span class="text-gray-600">{{ product.rating }}</span>
                        </div>
                      </div>
                      <div class="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin :size="14" class="mr-1" />
                        <span>{{ product.location || '未知' }}</span>
                      </div>
                      <p class="text-gray-600 text-sm mb-3">
                        {{ product.description || '暂无描述' }}
                      </p>

                      <div class="grid grid-cols-2 gap-2 mb-3">
                        <div v-if="product.venueSize" class="text-sm text-gray-500">
                          <Maximize2 :size="14" class="inline mr-1" />
                          <span>场地面积: {{ product.venueSize }}㎡</span>
                        </div>
                        <div v-if="product.minTables" class="text-sm text-gray-500">
                          <Users :size="14" class="inline mr-1" />
                          <span>最少桌数: {{ product.minTables }}桌</span>
                        </div>
                        <div v-if="product.maxTables" class="text-sm text-gray-500">
                          <Users :size="14" class="inline mr-1" />
                          <span>最多桌数: {{ product.maxTables }}桌</span>
                        </div>
                        <div v-if="product.cateringStyleList?.length" class="text-sm text-gray-500">
                          <Utensils :size="14" class="inline mr-1" />
                          <span>{{ product.cateringStyleList.join('、') }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-between items-center pt-3 mt-auto border-t border-gray-100">
                      <div>
                        <span class="text-amber-600 font-bold text-lg">
                          ￥{{ product.price.toLocaleString() }}
                        </span>
                        <span class="text-gray-500 text-sm ml-1">起</span>
                      </div>
                      <NButton
                        type="warning"
                        size="small"
                        class="bg-amber-600"
                        @click="viewDetails(product.id)"
                      >
                        查看详情
                      </NButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div v-if="products.list.length > 0" class="mt-4 flex justify-center">
              <NPagination
                v-model:page="queryParams.pageNum"
                :page-count="products.pages"
                :page-size="queryParams.pageSize"
                @update:page="fetchProducts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hotel-list-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}

/* 中国风细节 */
.banner h1 {
  font-family: 'STZhongsong', 'SimSun', serif;
}

.hotel-card {
  transition: all 0.3s ease;
}

.hotel-card:hover {
  border-color: #d97706;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hotel-card {
    flex-direction: column;
  }

  .hotel-card > div:first-child {
    width: 100%;
    height: 200px;
  }
}
</style>
