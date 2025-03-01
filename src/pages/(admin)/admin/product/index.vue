<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NCard,
  NDataTable,
  NForm,
  NFormItem,
  NImage,
  NInput,
  NPopconfirm,
  NSelect,
  NSpace,
  NSwitch,
} from 'naive-ui'
import {
  EditIcon,
  EyeIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-vue-next'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { batchDeleteProducts, deleteProduct, getProducts, updateProductStatus } from '~/api/product'
import type { Product, ProductQueryParams } from '~/api/product/type'
import {
  ORDER_BY_OPTIONS,
  PRODUCT_STATUS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
} from '~/constants/product'
import ProductFormModal from '~/components/product/ProductFormModal.vue'

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
const columns = computed<DataTableColumns<Product>>(() => [
  { type: 'selection' },
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '商品图片',
    key: 'mainImage',
    width: 100,
    render(row) {
      return row.mainImage
        ? h(NImage, {
            width: 60,
            height: 60,
            src: row.mainImage,
            objectFit: 'cover',
            fallbackSrc: 'https://via.placeholder.com/60',
            previewDisabled: false,
          })
        : h('span', {}, '无图片')
    },
  },
  {
    title: '商品名称',
    key: 'productName',
    width: 200,
  },
  {
    title: '商品类型',
    key: 'productTypeName',
    width: 100,
  },
  {
    title: '价格',
    key: 'price',
    width: 100,
    render(row) {
      return `￥${row.price}`
    },
  },
  {
    title: '评分',
    key: 'rating',
    width: 80,
  },
  {
    title: '库存',
    key: 'stock',
    width: 80,
  },
  {
    title: '销量',
    key: 'sales',
    width: 80,
  },
  {
    title: '地址',
    key: 'location',
    width: 150,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(
        NSwitch,
        {
          value: row.status === PRODUCT_STATUS.ON_SHELF,
          checkedValue: true,
          uncheckedValue: false,
          onUpdateValue: (value) => {
            handleStatusChange(row.id, value ? PRODUCT_STATUS.ON_SHELF : PRODUCT_STATUS.OFF_SHELF)
          },
        },
        {
          checked: () => '上架',
          unchecked: () => '下架',
        },
      )
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    fixed: 'right',
    render(row) {
      return h(NSpace, { justify: 'center' }, [
        h(
          NButton,
          {
            type: 'info',
            size: 'small',
            onClick: () => handleView(row),
          },
          {
            default: () => '查看',
            icon: () => h(EyeIcon, { size: 14 }),
          },
        ),
        h(
          NButton,
          {
            type: 'primary',
            size: 'small',
            onClick: () => handleEdit(row),
          },
          {
            default: () => '编辑',
            icon: () => h(EditIcon, { size: 14 }),
          },
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDelete(row.id),
          },
          {
            default: () => '确定删除该商品吗？',
            trigger: () =>
              h(
                NButton,
                {
                  type: 'error',
                  size: 'small',
                },
                {
                  default: () => '删除',
                  icon: () => h(TrashIcon, { size: 14 }),
                },
              ),
          },
        ),
      ])
    },
  },
])

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
      if (tableData.value.length === 1 && pagination?.page > 1) {
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
