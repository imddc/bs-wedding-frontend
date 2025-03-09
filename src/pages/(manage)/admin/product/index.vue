<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NCard,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSpace,
} from 'naive-ui'
import type { PaginationProps } from 'naive-ui'
import { PlusIcon, RefreshCwIcon, SearchIcon, TrashIcon } from 'lucide-vue-next'
import { batchDeleteProducts, deleteProduct, getProducts, updateProductStatus } from '~/api/product'
import type { Product, ProductQueryParams } from '~/api/product/type'
import { ORDER_BY_OPTIONS, PRODUCT_STATUS_OPTIONS, PRODUCT_TYPE_OPTIONS } from '~/constants/product'
import ProductFormModal from '~/components/product/ProductFormModal.vue'
import { createColumns } from './helper'

// 表格数据和加载状态
const tableData = ref<Product[]>([])
const loading = ref(false)
const selectedRowKeys = ref<(string | number)[]>([])

// 分页
const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
})

// 搜索表单
const searchForm = reactive<ProductQueryParams>({
  productName: '',
  productType: undefined,
  status: undefined,
  location: '',
  pageNum: 1,
  pageSize: 10,
  orderBy: 'update_time_desc',
})

// 弹窗控制
const showModal = ref(false)
const formType = ref<'create' | 'update' | 'view'>('create')
const currentId = ref<number | null>(null)
const modalProductType = ref<number | null>(null)

// 唯一键
const rowKey = (row: Product) => row.id

// 表格列定义

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const params: ProductQueryParams = {
      ...searchForm,
      pageNum: pagination.page,
      pageSize: pagination.pageSize,
    }
    const res = await getProducts(params)
    if (res.success) {
      tableData.value = res.data.list
      pagination.page = res.data.pageNum
      pagination.pageSize = res.data.pageSize
      pagination.itemCount = res.data.total
    } else {
      window.$message.error(res.message || '获取商品列表失败')
    }
  } catch (error) {
    console.error('获取商品列表出错', error)
    window.$message.error('获取商品列表出错')
  } finally {
    loading.value = false
  }
}

// 页码变化
function handlePageChange(page: number) {
  pagination.page = page
  loadData()
}

// 每页数量变化
function handlePageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.page = 1
  loadData()
}

// 搜索
function handleSearch() {
  pagination.page = 1
  loadData()
}

// 重置搜索
function resetSearch() {
  searchForm.productName = ''
  searchForm.productType = undefined
  searchForm.status = undefined
  searchForm.location = ''
  searchForm.orderBy = 'update_time_desc'
  pagination.page = 1
  loadData()
}

// 选中行变化
function handleCheckedRowKeysChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys
}

// 创建商品
function handleCreate() {
  formType.value = 'create'
  currentId.value = null
  modalProductType.value = null
  showModal.value = true
}

const columns = createColumns({
  handleStatusChange,
  handleView,
  handleEdit,
  handleDelete,
})

// 查看商品
function handleView(row: Product) {
  formType.value = 'view'
  currentId.value = row.id
  modalProductType.value = row.productType
  showModal.value = true
}

// 编辑商品
function handleEdit(row: Product) {
  formType.value = 'update'
  currentId.value = row.id
  modalProductType.value = row.productType
  showModal.value = true
}

// 删除商品
async function handleDelete(id: number) {
  try {
    const res = await deleteProduct(id)
    if (res.success) {
      window.$message.success('删除成功')
      if (tableData.value.length === 1 && pagination.page > 1) {
        pagination.page--
      }
      loadData()
    } else {
      window.$message.error(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除商品出错', error)
    window.$message.error('删除商品出错')
  }
}

// 批量删除商品
async function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0) {
    window.$message.warning('请先选择要删除的商品')
    return
  }

  try {
    const res = await batchDeleteProducts(selectedRowKeys.value as number[])
    if (res.success) {
      window.$message.success('批量删除成功')
      selectedRowKeys.value = []
      loadData()
    } else {
      window.$message.error(res.message || '批量删除失败')
    }
  } catch (error) {
    console.error('批量删除商品出错', error)
    window.$message.error('批量删除商品出错')
  }
}

// 修改商品状态
async function handleStatusChange(id: number, status: number) {
  try {
    const res = await updateProductStatus(id, status)
    if (res.success) {
      window.$message.success('状态更新成功')
      loadData()
    } else {
      window.$message.error(res.message || '状态更新失败')
    }
  } catch (error) {
    console.error('更新商品状态出错', error)
    window.$message.error('更新商品状态出错')
  }
}

// 弹窗操作成功回调
function handleSuccess() {
  loadData()
}

// 初始加载
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="p-4">
    <NCard title="商品管理" class="shadow">
      <!-- 搜索条件 -->
      <div class="mb-4">
        <NForm inline :label-width="80" :model="searchForm">
          <NFormItem label="商品名称">
            <NInput
              v-model:value="searchForm.productName"
              placeholder="请输入商品名称"
              clearable
            />
          </NFormItem>
          <NFormItem label="商品类型">
            <NSelect
              v-model:value="searchForm.productType"
              :options="PRODUCT_TYPE_OPTIONS"
              placeholder="请选择商品类型"
              clearable
              style="width: 180px"
            />
          </NFormItem>
          <NFormItem label="状态">
            <NSelect
              v-model:value="searchForm.status"
              :options="PRODUCT_STATUS_OPTIONS"
              placeholder="请选择状态"
              clearable
              style="width: 180px"
            />
          </NFormItem>
          <NFormItem label="城市">
            <NInput
              v-model:value="searchForm.location"
              placeholder="请输入城市"
              clearable
            />
          </NFormItem>
          <NFormItem>
            <NSpace>
              <NButton type="primary" @click="handleSearch">
                <template #icon>
                  <SearchIcon />
                </template>
                搜索
              </NButton>
              <NButton @click="resetSearch">
                <template #icon>
                  <RefreshCwIcon />
                </template>
                重置
              </NButton>
            </NSpace>
          </NFormItem>
        </NForm>
      </div>

      <!-- 操作按钮 -->
      <div class="mb-4 flex justify-between">
        <NSpace>
          <NButton type="primary" @click="handleCreate">
            <template #icon>
              <PlusIcon />
            </template>
            新增商品
          </NButton>
          <NButton type="error" :disabled="!selectedRowKeys.length" @click="handleBatchDelete">
            <template #icon>
              <TrashIcon />
            </template>
            批量删除
          </NButton>
        </NSpace>
        <NSpace>
          <NSelect
            v-model:value="searchForm.orderBy"
            :options="ORDER_BY_OPTIONS"
            placeholder="请选择排序方式"
            style="width: 160px"
            @update:value="handleSearch"
          />
        </NSpace>
      </div>

      <!-- 数据表格 -->
      <NDataTable
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="rowKey"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @update:checked-row-keys="handleCheckedRowKeysChange"
      />
    </NCard>

    <!-- 商品表单弹窗 -->
    <ProductFormModal
      v-model:show="showModal"
      :form-type="formType"
      :product-id="currentId"
      :product-type="modalProductType"
      @success="handleSuccess"
    />
  </div>
</template>
