<!-- src/views/wedding-package/WeddingPackageList.vue -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NEmpty, NPagination, NSpin } from 'naive-ui'
import { Gift } from 'lucide-vue-next'
import { confirmWeddingPackage, deleteWeddingPackage, getWeddingPackageList } from '~/api/weddingPackage'
import type { PaginationResult, WeddingPackageItem } from '~/api/weddingPackage/type'
import { useUserStore } from '~/stores'
import CreatePackageModal from '~/components/weddingPackage/CreatePackageModal.vue'
import PackageCard from '~/components/weddingPackage/PackageCard.vue'

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

// 创建弹窗控制
const showCreateModal = ref(false)

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

// 创建成功回调
function handleCreateSuccess(packageId: number) {
  // 刷新列表
  fetchWeddingPackages()
  // 跳转到详情页
  router.push(`/weddingPackage/${packageId}`)
}

// 修改原有的创建方法
function createWeddingPackage() {
  showCreateModal.value = true
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

// 处理方案确认
async function handlePackageConfirm(packageId: number) {
  try {
    // 更新方案状态为已确认
    const response = await confirmWeddingPackage(packageId)

    if (response.success) {
      window.$message.success('方案已确认')
      // 刷新列表
      fetchWeddingPackages()
    } else {
      window.$message.error('方案确认失败')
    }
  } catch (error) {
    console.error('确认方案失败:', error)
    window.$message.error('方案确认失败')
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
      <!-- 列表内容 -->
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
            <PackageCard
              v-for="pkg in weddingPackages.records"
              :key="pkg.id"
              :package="pkg"
              @edit="editPackage(pkg.id)"
              @view="viewPackageDetails(pkg.id)"
              @delete="handleDeletePackage(pkg.id)"
              @confirm="handlePackageConfirm(pkg.id)"
            />
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

    <!-- 添加创建弹窗组件 -->
    <CreatePackageModal
      v-model:show="showCreateModal"
      @success="handleCreateSuccess"
    />
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
  border-color: #db2777;
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
