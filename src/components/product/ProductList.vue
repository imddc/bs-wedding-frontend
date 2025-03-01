<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
import { Plus, RefreshCw, RefreshCwIcon, Search } from 'lucide-vue-next'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NInputNumber, NPopconfirm, NSelect, NSpace, NTag } from 'naive-ui'
import type { Product, ProductQueryDTO } from '~/api/product/type'
import { changeProductStatus, deleteProduct, getProductList } from '~/api/product'
import { PRODUCT_STATUS, PRODUCT_STATUS_NAMES, PRODUCT_STATUS_TAGS } from '~/constants/product'

interface Props {
  productType: number
  productTypeLabel: string
  categoryOptions: Array<{ label: string, value: number }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit', raw: Product): void
}>()

defineSlots<{
  default: () => void
  editModal: () => void
}>()

// Table state
const loading = ref(false)
const tableData = ref<Product[]>([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50],
})

// Search form
const searchForm = reactive<ProductQueryDTO>({
  current: 1,
  size: 10,
  productType: props.productType,
  productName: '',
  categoryId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  location: '',
  status: undefined,
})

// Status options for dropdown
const statusOptions = [
  { label: PRODUCT_STATUS_NAMES[PRODUCT_STATUS.ONLINE], value: PRODUCT_STATUS.ONLINE },
  { label: PRODUCT_STATUS_NAMES[PRODUCT_STATUS.OFFLINE], value: PRODUCT_STATUS.OFFLINE },
]

// Table columns
const columns = computed(() => [
  { title: 'ID', key: 'id', width: 80 },
  { title: '商品名称', key: 'productName', width: 200, ellipsis: { tooltip: true } },
  { title: '价格', key: 'price', width: 100, sorter: 'default' },
  { title: '地址', key: 'location', width: 200, ellipsis: { tooltip: true } },
  { title: '评分', key: 'rating', width: 80 },
  { title: '销量', key: 'sales', width: 80 },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row: Product) {
      const status = PRODUCT_STATUS_TAGS[row.status]
      return h(NTag, { type: status.type }, { default: () => status.label })
    },
  },
  {
    title: '更新时间',
    key: 'updateTime',
    width: 180,
    render(row: Product) {
      return row.updateTime ? row.updateTime.substring(0, 19).replace('T', ' ') : ''
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 280,
    fixed: 'right',
    render(row: Product) {
      return h(NSpace, {}, {
        default: () => [
          h(
            NButton,
            { type: 'primary', size: 'small', onClick: () => handleEdit(row) },
            { default: () => '编辑' },
          ),
          h(
            NButton,
            {
              type: row.status === PRODUCT_STATUS.ONLINE ? 'warning' : 'success',
              size: 'small',
              onClick: () => handleStatusChange(row),
            },
            { default: () => row.status === PRODUCT_STATUS.ONLINE ? '下架' : '上架' },
          ),
          h(
            NPopconfirm,
            { onPositiveClick: () => handleDelete(row.id) },
            {
              default: () => '确认删除该商品吗？',
              trigger: () => h(
                NButton,
                { type: 'error', size: 'small' },
                { default: () => '删除' },
              ),
            },
          ),
        ],
      })
    },
  },
])

// Methods
async function fetchData() {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      current: pagination.page,
      size: pagination.pageSize,
    }

    const response = await getProductList(params)
    if (response.success) {
      const pageData = response.data
      tableData.value = pageData.records
      pagination.itemCount = pageData.total
    } else {
      window.$message.error(response.message || '获取数据失败')
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    window.$message.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  pagination.page = page
  fetchData()
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function resetSearch() {
  searchForm.productName = ''
  searchForm.categoryId = undefined
  searchForm.minPrice = undefined
  searchForm.maxPrice = undefined
  searchForm.location = ''
  searchForm.status = undefined
  handleSearch()
}

function refreshTable() {
  fetchData()
}

function handleAdd() {
  emit('add')
}

function handleEdit(row: Product) {
  emit('edit', row)
}

async function handleDelete(id: number) {
  try {
    const response = await deleteProduct(id)
    if (response.success) {
      window.$message.success('删除成功')
      refreshTable()
    } else {
      window.$message.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('Failed to delete:', error)
    window.$message.error('删除失败')
  }
}

async function handleStatusChange(row: Product) {
  const newStatus = row.status === PRODUCT_STATUS.ONLINE ? PRODUCT_STATUS.OFFLINE : PRODUCT_STATUS.ONLINE
  const statusText = newStatus === PRODUCT_STATUS.ONLINE ? '上架' : '下架'

  try {
    const response = await changeProductStatus(row.id, newStatus)
    if (response.success) {
      window.$message.success(`${statusText}成功`)
      refreshTable()
    } else {
      window.$message.error(response.message || `${statusText}失败`)
    }
  } catch (error) {
    console.error(`Failed to ${statusText}:`, error)
    window.$message.error(`${statusText}失败`)
  }
}

// Watch for productType changes to update searchForm
watch(() => props.productType, (newVal) => {
  searchForm.productType = newVal
  handleSearch()
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <!-- Search Form -->
    <NCard title="搜索条件" class="mb-4">
      <NForm
        inline
        :label-width="80"
        :model="searchForm"
        @keydown.enter.prevent="handleSearch"
      >
        <NFormItem label="商品名称">
          <NInput v-model:value="searchForm.productName" placeholder="请输入商品名称" />
        </NFormItem>
        <NFormItem label="商品分类">
          <NSelect
            v-model:value="searchForm.categoryId"
            placeholder="请选择分类"
            clearable
            :options="categoryOptions"
          />
        </NFormItem>
        <NFormItem label="商品状态">
          <NSelect
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            clearable
            :options="statusOptions"
          />
        </NFormItem>
        <NFormItem label="价格区间">
          <NInputGroup>
            <NInputNumber
              v-model:value="searchForm.minPrice"
              placeholder="最低价"
              :min="0"
              clearable
            />
            <div class="px-1">
              -
            </div>
            <NInputNumber
              v-model:value="searchForm.maxPrice"
              placeholder="最高价"
              :min="0"
              clearable
            />
          </NInputGroup>
        </NFormItem>
        <NFormItem label="位置">
          <NInput v-model:value="searchForm.location" placeholder="请输入位置" />
        </NFormItem>
        <NFormItem>
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
        </NFormItem>
      </NForm>
    </NCard>

    <!-- Action Buttons -->
    <div class="mb-4 flex justify-between">
      <NButton type="primary" @click="handleAdd">
        <template #icon>
          <Plus />
        </template>
        添加{{ productTypeLabel }}
      </NButton>
      <NSpace>
        <NButton @click="refreshTable">
          <template #icon>
            <RefreshCwIcon />
          </template>
          刷新
        </NButton>
      </NSpace>
    </div>

    <!-- Data Table -->
    <NDataTable
      ref="tableRef"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      @update:page="handlePageChange"
    />

    <!-- Edit Modal -->
    <slot name="edit-modal" />
  </div>
</template>
