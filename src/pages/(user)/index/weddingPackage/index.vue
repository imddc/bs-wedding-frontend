<!-- src/views/wedding-package/WeddingPackageList.vue -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NEmpty, NPagination, NSelect, NSpin, NTag, NPopconfirm } from 'naive-ui'
import { Gift, Heart, ScrollText, MapPin, CalendarClock, Coins } from 'lucide-vue-next'
import { getWeddingPackageList, deleteWeddingPackage } from '~/api/weddingPackage'
import type { WeddingPackageItem, PaginationResult } from '~/api/weddingPackage/type'
import { WeddingPackageStatus, WeddingPackageStatusMap, ProductType, ProductTypeMap, CityOptions, BudgetRangeOptions } from '~/constants/weddingPackage'
import { handleImgUrl } from '~/utils/core'
import { useUserStore } from '~/stores'

const userStore = useUserStore()
const router = useRouter()

// 婚礼方案列表数据
const weddingPackages = ref<PaginationResult<WeddingPackageItem>>({
  records: [],
  total: 0,
  size: 10,
  current: 1,
  pages: 0,
})

// 加载状态
const loading = ref(false)

// 查询参数
const queryParams = reactive({
  page: 1,
  size: 8,
  location: undefined as string | undefined,
  budgetRange: null as number[] | null,
})

// 获取婚礼方案列表
async function fetchWeddingPackages() {
  loading.value = true
  try {
    const response = await getWeddingPackageList({
      page: queryParams.page,
      size: queryParams.size,
      userId: userStore.userInfo?.id,
    })
    if (response.success) {
      weddingPackages.value = response.data
    } else {
      window.$message.error('获取婚礼方案列表失败')
    }
  } catch (error) {
    window.$message.error('获取婚礼方案列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  queryParams.page = 1
  fetchWeddingPackages()
}

// 重置
function handleReset() {
  queryParams.location = undefined
  queryParams.budgetRange = null
  queryParams.page = 1
  fetchWeddingPackages()
}

// 创建新方案
function createWeddingPackage() {
  router.push('/weddingPackage/create')
}

// 查看方案详情
function viewPackageDetails(id: number) {
  router.push(`/weddingPackage/${id}`)
}

// 编辑方案
function editPackage(id: number) {
  router.push(`/weddingPackage/${id}`)
}

// 删除方案
async function handleDeletePackage(id: number) {
  try {
    const response = await deleteWeddingPackage(id)
    if (response.success) {
      window.$message.success('删除方案成功')
      fetchWeddingPackages()
    } else {
      window.$message.error('删除方案失败')
    }
  } catch (error) {
    window.$message.error('删除方案失败')
    console.error(error)
  }
}

// 格式化预算显示
function formatBudget(budget: number): string {
  if (budget >= 10000) {
    return `${(budget / 10000).toFixed(1)}万`
  }
  return `${budget}元`
}

// 获取状态标签类型
function getStatusTagType(status: number): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case WeddingPackageStatus.DRAFT:
      return 'warning'
    case WeddingPackageStatus.CONFIRMED:
      return 'success'
    default:
      return 'default'
  }
}

// 初始化
onMounted(() => {
  fetchWeddingPackages()
})
</script>

<template>
  <div class="wedding-package-list-container">
    <!-- 头部横幅 -->
    <div class="banner relative h-64 bg-gradient-to-r from-pink-800 to-pink-600 mb-8 overflow-hidden">
      <div class="container mx-auto px-4 h-full flex flex-col justify-center z-10 relative">
        <h1 class="text-4xl font-bold text-white mb-2">
          婚礼方案定制
        </h1>
        <p class="text-xl text-white opacity-90">
          专属您的一站式婚礼解决方案，打造难忘婚礼体验
        </p>
      </div>
      <div class="absolute right-0 bottom-0 opacity-20">
        <Gift :size="160" color="white" />
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- 筛选和列表部分 -->
      <div class="flex flex-wrap md:flex-nowrap gap-6">
        <!-- 筛选侧边栏 -->
        <div class="w-full md:w-1/4 lg:w-1/5">
          <div class="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
            <h3 class="text-lg font-bold mb-4 pb-2 border-b border-pink-100">
              筛选条件
            </h3>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">所在城市</label>
              <NSelect
                v-model:value="queryParams.location"
                filterable
                clearable
                placeholder="选择城市"
                :options="CityOptions"
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">预算范围</label>
              <NSelect
                v-model:value="queryParams.budgetRange"
                clearable
                placeholder="选择预算范围"
                :options="BudgetRangeOptions as any"
              />
            </div>

            <div class="flex items-center gap-2 pt-2">
              <NButton
                type="primary"
                color="#DB2777"
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
                我的婚礼方案
              </div>
              <NButton type="primary" color="#DB2777" @click="createWeddingPackage">
                创建新方案
              </NButton>
            </div>

            <div v-if="loading" class="py-8 flex justify-center">
              <NSpin size="large" />
            </div>
            <div v-else-if="weddingPackages.records.length === 0" class="py-8">
              <NEmpty description="暂无婚礼方案">
                <template #extra>
                  <NButton type="primary" color="#DB2777" @click="createWeddingPackage">
                    立即创建
                  </NButton>
                </template>
              </NEmpty>
            </div>
            <div v-else>
              <!-- 卡片列表 -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  v-for="pkg in weddingPackages.records"
                  :key="pkg.id"
                  class="package-card bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition relative"
                >
                  <div class="flex flex-col h-full">
                    <div class="p-4 border-b border-gray-100">
                      <div class="flex justify-between items-start">
                        <h3 class="text-lg font-bold mb-1 line-clamp-1 flex-1">
                          {{ pkg.packageName }}
                        </h3>
                        <NTag :type="getStatusTagType(pkg.status)" size="small">
                          {{ WeddingPackageStatusMap[pkg.status] }}
                        </NTag>
                      </div>
                      <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-2">
                        <div class="flex items-center">
                          <MapPin :size="14" class="mr-1" />
                          <span>{{ pkg.location }}</span>
                        </div>
                        <div class="flex items-center">
                          <Coins :size="14" class="mr-1" />
                          <span>预算: {{ formatBudget(pkg.budget) }}</span>
                        </div>
                        <div class="flex items-center">
                          <CalendarClock :size="14" class="mr-1" />
                          <span>{{ new Date(pkg.createTime).toLocaleDateString() }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="p-4 flex-1">
                      <div class="grid grid-cols-3 gap-3 mb-4">
                        <!-- 婚纱摄影 -->
                        <div class="flex flex-col overflow-hidden bg-pink-50 rounded-lg p-2">
                          <div class="h-24 overflow-hidden rounded-md mb-2">
                            <img
                              v-if="pkg.photographyProduct?.mainImage"
                              :src="handleImgUrl(pkg.photographyProduct.mainImage)"
                              :alt="pkg.photographyProduct.productName"
                              class="w-full h-full object-cover"
                            >
                            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Heart class="text-pink-300" :size="24" />
                            </div>
                          </div>
                          <div class="text-xs">
                            <div class="font-bold line-clamp-1 text-pink-800">{{ ProductTypeMap[ProductType.PHOTOGRAPHY] }}</div>
                            <div class="line-clamp-1">{{ pkg.photographyProduct.productName }}</div>
                            <div class="text-pink-600">¥{{ pkg.photographyProduct.price.toLocaleString() }}</div>
                          </div>
                        </div>
                        
                        <!-- 婚宴酒店 -->
                        <div class="flex flex-col overflow-hidden bg-blue-50 rounded-lg p-2">
                          <div class="h-24 overflow-hidden rounded-md mb-2">
                            <img
                              v-if="pkg.venueProduct?.mainImage"
                              :src="handleImgUrl(pkg.venueProduct.mainImage)"
                              :alt="pkg.venueProduct.productName"
                              class="w-full h-full object-cover"
                            >
                            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                              <MapPin class="text-blue-300" :size="24" />
                            </div>
                          </div>
                          <div class="text-xs">
                            <div class="font-bold line-clamp-1 text-blue-800">{{ ProductTypeMap[ProductType.HOTEL] }}</div>
                            <div class="line-clamp-1">{{ pkg.venueProduct.productName }}</div>
                            <div class="text-blue-600">¥{{ pkg.venueProduct.price.toLocaleString() }}</div>
                          </div>
                        </div>
                        
                        <!-- 司仪主持 -->
                        <div class="flex flex-col overflow-hidden bg-purple-50 rounded-lg p-2">
                          <div class="h-24 overflow-hidden rounded-md mb-2">
                            <img
                              v-if="pkg.hostProduct?.mainImage"
                              :src="handleImgUrl(pkg.hostProduct.mainImage)"
                              :alt="pkg.hostProduct.productName"
                              class="w-full h-full object-cover"
                            >
                            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ScrollText class="text-purple-300" :size="24" />
                            </div>
                          </div>
                          <div class="text-xs">
                            <div class="font-bold line-clamp-1 text-purple-800">{{ ProductTypeMap[ProductType.HOST] }}</div>
                            <div class="line-clamp-1">{{ pkg.hostProduct.productName }}</div>
                            <div class="text-purple-600">¥{{ pkg.hostProduct.price.toLocaleString() }}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="flex justify-between items-center mt-2">
                        <div class="text-sm">
                          <span class="text-gray-500">总价: </span>
                          <span class="text-lg font-bold text-pink-700">¥{{ pkg.totalPrice.toLocaleString() }}</span>
                        </div>
                        <div class="flex gap-2">
                          <NPopconfirm
                            positive-text="确定"
                            negative-text="取消"
                            @positive-click="handleDeletePackage(pkg.id)"
                          >
                            <template #trigger>
                              <NButton size="small" type="error" ghost>
                                删除
                              </NButton>
                            </template>
                            <template #default>
                              <div class="max-w-[200px]">
                                <p class="font-medium mb-1">确认删除</p>
                                <p class="text-gray-500 text-sm">是否确认删除该婚礼方案？此操作不可恢复。</p>
                              </div>
                            </template>
                          </NPopconfirm>
                          <NButton size="small" @click="editPackage(pkg.id)">
                            编辑
                          </NButton>
                          <NButton 
                            size="small" 
                            type="primary" 
                            color="#DB2777"
                            @click="viewPackageDetails(pkg.id)"
                          >
                            查看详情
                          </NButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div v-if="weddingPackages.records.length > 0" class="mt-6 flex justify-center">
              <NPagination
                v-model:page="weddingPackages.current"
                :page-count="weddingPackages.pages"
                :page-size="weddingPackages.size"
                @update:page="(page) => {
                  queryParams.page = page
                  fetchWeddingPackages()
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
.wedding-package-list-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}

/* 中国风字体 */
.banner h1 {
  font-family: 'STZhongsong', 'SimSun', serif;
}

.package-card {
  transition: all 0.3s ease;
}

.package-card:hover {
  border-color: #DB2777;
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

/* 添加删除按钮的hover效果 */
:deep(.n-button.n-button--error-type) {
  &:hover {
    color: #fff;
    background-color: #dc2626;
    border-color: #dc2626;
  }
}
</style>
