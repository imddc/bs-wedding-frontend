<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NCard,
  NDataTable,
  NInput,
  NModal,
  NPopconfirm,
} from 'naive-ui'
import {
  PlusIcon,
  RefreshCcwIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-vue-next'
import {
  checkFavoriteExists,
  createFavorite,
  deleteFavorite,
  pageFavorites,
} from '~/api/favorite'
import type {
  Favorite,
  FavoriteCreateParams,
  FavoriteQueryParams,
} from '~/api/favorite/type'
import {
  FAVORITE_TABLE_COLUMNS,
  INITIAL_QUERY_PARAMS,
  PAGINATION_CONFIG,
} from '~/constants/favorite'

// Table state
const tableRef = ref(null)
const loading = ref(false)
const tableData = ref<Favorite[]>([])
const total = ref(0)

// Query params
const queryParams = reactive<FavoriteQueryParams>({
  ...INITIAL_QUERY_PARAMS,
})

// Pagination
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  pageSizes: PAGINATION_CONFIG.pageSizes,
  showSizePicker: PAGINATION_CONFIG.showSizePicker,
  showQuickJumper: PAGINATION_CONFIG.showQuickJumper,
  pageSlot: PAGINATION_CONFIG.pageSlot,
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
})

// Sort state
const sorter = ref<{ columnKey: string, order: 'ascend' | 'descend' | false }>({
  columnKey: '',
  order: false,
})

// Row key function
const rowKey = (row: Favorite) => row.id

// Create form
const createModalVisible = ref(false)
const createForm = reactive<FavoriteCreateParams>({
  userId: 0,
  merchantId: 0,
})

// Action column
const mergedColumns = computed(() => {
  const columns = [...FAVORITE_TABLE_COLUMNS]
  // Find the actions column and customize it
  const actionsColumn = columns.find(col => col.key === 'actions')
  if (actionsColumn) {
    actionsColumn.render = (row: Favorite) => {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDeleteFavorite(row.id),
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  class: 'flex items-center',
                },
                {
                  default: () => '删除',
                  icon: () => h(TrashIcon, { class: 'h-4 w-4 mr-1' }),
                },
              ),
            default: () => '确认删除该收藏记录？',
          },
        ),
      ])
    }
  }
  return columns
})

// Fetch data
async function fetchData() {
  loading.value = true
  try {
    const { current, size, userId, merchantId } = queryParams
    const response = await pageFavorites({
      current,
      size,
      userId,
      merchantId,
    })

    if (response.success) {
      const pageData = response.data
      tableData.value = pageData.records
      total.value = pageData.total
      pagination.itemCount = pageData.total
    } else {
      window.$message.error(response.message || '获取收藏列表失败')
    }
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
    window.$message.error('获取收藏列表失败')
  } finally {
    loading.value = false
  }
}

// Methods
function handleSearch() {
  queryParams.current = 1
  fetchData()
}

function resetSearch() {
  queryParams.userId = undefined
  queryParams.merchantId = undefined
  queryParams.current = 1
  fetchData()
}

function handlePageChange(page: number) {
  queryParams.current = page
  fetchData()
}

function handlePageSizeChange(pageSize: number) {
  queryParams.size = pageSize
  queryParams.current = 1
  fetchData()
}

function handleSorterChange(sorterInfo: any) {
  // Handle sorting if backend supports it
  sorter.value = sorterInfo
  fetchData()
}

function openCreateModal() {
  // Initialize with current query params if available
  createForm.userId = queryParams.userId || 0
  createForm.merchantId = queryParams.merchantId || 0
  createModalVisible.value = true
}

function closeCreateModal() {
  createModalVisible.value = false
}

async function handleCreateFavorite() {
  // Validate
  if (!createForm.userId || !createForm.merchantId) {
    window.$message.warning('请填写用户ID和商家ID')
    return
  }

  // Check if already exists
  const checkResponse = await checkFavoriteExists({
    userId: createForm.userId,
    merchantId: createForm.merchantId,
  })

  if (checkResponse.success && checkResponse.data) {
    window.$message.warning('该商家已被收藏，请勿重复操作')
    return
  }

  // Create
  loading.value = true
  try {
    const response = await createFavorite(createForm)
    if (response.success) {
      window.$message.success('收藏成功')
      createModalVisible.value = false
      fetchData()
    } else {
      window.$message.error(response.message || '收藏失败')
    }
  } catch (error) {
    console.error('Failed to create favorite:', error)
    window.$message.error('收藏失败')
  } finally {
    loading.value = false
  }
}

async function handleDeleteFavorite(id: number) {
  loading.value = true
  try {
    const response = await deleteFavorite(id)
    if (response.success) {
      window.$message.success('取消收藏成功')
      fetchData()
    } else {
      window.$message.error(response.message || '取消收藏失败')
    }
  } catch (error) {
    console.error('Failed to delete favorite:', error)
    window.$message.error('取消收藏失败')
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="favorite-page w-full">
    <NCard title="收藏管理">
      <div class="mb-4 flex justify-between items-center">
        <div class="search-container flex gap-4">
          <NInput
            v-model:value="queryParams.userId"
            type="number"
            placeholder="用户ID"
            clearable
            class="w-40"
          />
          <NInput
            v-model:value="queryParams.merchantId"
            type="number"
            placeholder="商家ID"
            clearable
            class="w-40"
          />
          <NButton type="primary" @click="handleSearch">
            <template #icon>
              <SearchIcon class="mr-1" />
            </template>
            搜索
          </NButton>
          <NButton @click="resetSearch">
            <template #icon>
              <RefreshCcwIcon class="mr-1" />
            </template>
            重置
          </NButton>
        </div>
        <div>
          <NButton type="primary" @click="openCreateModal">
            <template #icon>
              <PlusIcon class="mr-1" />
            </template>
            新增收藏
          </NButton>
        </div>
      </div>

      <NDataTable
        ref="tableRef"
        :columns="mergedColumns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="rowKey"
        striped
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @update:sorter="handleSorterChange"
      />

      <NModal
        v-model:show="createModalVisible"
        preset="dialog"
        title="新增收藏"
        positive-text="确认"
        negative-text="取消"
        @positive-click="handleCreateFavorite"
        @negative-click="closeCreateModal"
      >
        <div class="grid gap-4">
          <div>
            <div class="mb-1">
              用户ID
            </div>
            <NInput
              v-model:value="createForm.userId"
              type="number"
              placeholder="请输入用户ID"
              :disabled="!!queryParams.userId"
            />
          </div>
          <div>
            <div class="mb-1">
              商家ID
            </div>
            <NInput
              v-model:value="createForm.merchantId"
              type="number"
              placeholder="请输入商家ID"
              :disabled="!!queryParams.merchantId"
            />
          </div>
        </div>
      </NModal>
    </NCard>
  </div>
</template>
