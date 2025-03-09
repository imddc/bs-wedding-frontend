<!-- src/views/HostList.vue -->
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NGrid, NGridItem, NInput, NInputNumber, NPagination, NRate, NSelect, NSpin } from 'naive-ui'
import { Mic } from 'lucide-vue-next'
import {
  getProducts,
} from '~/api/product'
import type {
  HostProduct,
  PageResult,
  ProductQueryParams,
} from '~/api/product/type'
import { EXPERIENCE_OPTIONS, LOCATION_OPTIONS, SORT_OPTIONS } from '~/constants/product'
import HostCard from '~/components/host/HostCard.vue'

const router = useRouter()

// 商品列表数据
const products = ref<PageResult<HostProduct>>({
  total: 0,
  list: [],
  pageNum: 1,
  pageSize: 10,
  pages: 0,
})

// 加载状态
const loading = ref(false)

// 查询参数
const queryParams = reactive<ProductQueryParams>({
  productType: 3, // 假设3为司仪商品
  pageNum: 1,
  pageSize: 9,
  orderBy: 'rating_desc',
})

// 筛选特定参数
const experienceYears = ref<number>()
const language = ref<string>()

// 监听特定参数变化，转换为tags查询
watch([experienceYears, language], () => {
  const tagValues = []
  if (experienceYears.value)
    tagValues.push(`hostingExperience:${experienceYears.value}`)
  if (language.value)
    tagValues.push(`language:${language.value}`)

  if (tagValues.length > 0) {
    queryParams.tags = tagValues.join(',')
  } else {
    queryParams.tags = undefined
  }
})

// 获取商品列表
async function fetchProducts() {
  loading.value = true
  try {
    const response = await getProducts(queryParams)
    if (response.success) {
      products.value = response.data
    } else {
      window.$message.error('获取司仪列表失败')
    }
  } catch (error) {
    window.$message.error('获取司仪列表失败')
    console.error(error)
  } finally {
    loading.value = false
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
  experienceYears.value = undefined
  language.value = undefined
  queryParams.pageNum = 1
  queryParams.orderBy = 'rating_desc'
  fetchProducts()
}

// 查看商品详情
function viewDetails(id: number) {
  router.push(`/siyi/${id}`)
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="host-list-container">
    <!-- 头部横幅 -->
    <div
      class="banner relative h-64 bg-gradient-to-r from-indigo-800 to-indigo-600 mb-8 overflow-hidden"
    >
      <div class="container mx-auto px-4 h-full flex flex-col justify-center z-10 relative">
        <h1 class="text-4xl font-bold text-white mb-2">
          典礼之声 · 婚礼司仪
        </h1>
        <p class="text-xl text-white opacity-90">
          见证真爱，主持盛典
        </p>
      </div>
      <div class="absolute right-0 bottom-0 opacity-20">
        <Mic :size="160" color="white" />
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- 筛选和列表部分 -->
      <div class="flex flex-wrap md:flex-nowrap gap-6">
        <!-- 筛选侧边栏 -->
        <div class="w-full md:w-1/4 lg:w-1/5">
          <div class="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
            <h3 class="text-lg font-bold mb-4 pb-2 border-b border-indigo-100">
              筛选条件
            </h3>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">司仪姓名</label>
              <NInput
                v-model:value="queryParams.productName"
                placeholder="请输入司仪姓名"
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
                :options="LOCATION_OPTIONS"
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">主持经验</label>
              <NSelect
                v-model:value="experienceYears"
                clearable
                placeholder="选择经验年限"
                :options="EXPERIENCE_OPTIONS"
              />
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
                司仪列表
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">排序：</span>
                <NSelect
                  v-model:value="queryParams.orderBy"
                  size="small"
                  :options="SORT_OPTIONS"
                  style="width: 120px"
                />
              </div>
            </div>

            <div v-if="loading" class="py-8 flex justify-center">
              <NSpin size="large" />
            </div>
            <div v-else-if="products.list.length === 0" class="text-center py-8 text-gray-500">
              暂无司仪，请调整筛选条件
            </div>
            <div v-else>
              <NGrid x-gap="16" y-gap="16" cols="3 s:2 m:2 l:3">
                <NGridItem v-for="product in products.list" :key="product.id">
                  <HostCard
                    :product="product"
                    @view-details="viewDetails"
                  />
                </NGridItem>
              </NGrid>
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
.host-list-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}

.host-card {
  transition: all 0.3s ease;
}

.host-card:hover {
  transform: translateY(-5px);
}

.host-item {
  transition: all 0.3s ease;
}

.host-item:hover {
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

/* 中国风细节 */
.banner h1 {
  font-family: 'STZhongsong', 'SimSun', serif;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .banner h1 {
    font-size: 1.875rem;
  }
}
</style>
