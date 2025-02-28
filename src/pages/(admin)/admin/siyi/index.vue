<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import type {
  DataTableColumns,
} from 'naive-ui'
import {
  NButton,
  NCard,
  NDataTable,
  NFormItem,
  NImage,
  NInput,
  NInputNumber,
  NSelect,
  NSpace,
  NTag,
  useMessage,
} from 'naive-ui'
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-vue-next'
import { deleteProduct, getCategoriesByType, getProductsByType, updateProductStatus } from '~/api/product'
import { PRODUCT_STATUS_OPTIONS, ProductStatus, ProductType } from '~/api/product/type'
import type { HostProduct, ProductQuery, SelectOption } from '~/api/product/type'
import DetailModal from '~/components/siyi/DetailModal.vue'

// 状态
const loading = ref(false)
const hostList = ref<HostProduct[]>([])
const showDetailModal = ref(false)
const isEdit = ref(false)
const currentHost = ref<HostProduct | null>(null)
const categoryOptions = ref<SelectOption[]>([])
const message = useMessage()

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50],
})

// 搜索条件
const searchForm = reactive({
  keyword: '',
  categoryId: null as number | null,
  minPrice: null as number | null,
  maxPrice: null as number | null,
  minExperience: null as number | null,
  maxExperience: null as number | null,
  hostingStyle: '',
  status: null as number | null,
})

// 表格列定义
const columns = computed<DataTableColumns<HostProduct>>(() => [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '图片',
    key: 'mainImage',
    width: 100,
    render(row) {
      return row.mainImage
        ? h(NImage, {
            src: row.mainImage,
            width: 60,
            height: 60,
            objectFit: 'cover',
            fallbackSrc: 'https://via.placeholder.com/60',
            previewDisabled: true,
          })
        : '无图片'
    },
  },
  {
    title: '司仪名称',
    key: 'productName',
    width: 160,
  },
  {
    title: '分类',
    key: 'categoryName',
    width: 120,
  },
  {
    title: '主持风格',
    key: 'hostingStyle',
    width: 120,
  },
  {
    title: '主持经验',
    key: 'hostingExperience',
    width: 100,
    render(row) {
      return row.hostingExperience ? `${row.hostingExperience}年` : '未知'
    },
  },
  {
    title: '价格',
    key: 'price',
    width: 100,
    render(row) {
      return `¥${row.price.toFixed(2)}`
    },
  },
  {
    title: '可用语言',
    key: 'languages',
    width: 150,
    render(row) {
      if (!row.languages)
        return '未设置'
      const languages = row.languages.split(',')
      return h(
        NSpace,
        { wrap: true, size: 'small' },
        {
          default: () => languages.map(lang =>
            h(
              NTag,
              { size: 'small', type: 'info' },
              { default: () => lang },
            ),
          ),
        },
      )
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.status === ProductStatus.ON ? 'success' : 'error',
          round: true,
        },
        { default: () => (row.status === ProductStatus.ON ? '上架' : '下架') },
      )
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 220,
    fixed: 'right',
    render(row) {
      return h(NSpace, {}, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              onClick: () => handleViewHost(row),
            },
            {
              default: () => '查看',
              icon: () => h(EyeIcon, { size: 16 }),
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => handleEditHost(row),
            },
            {
              default: () => '编辑',
              icon: () => h(PencilIcon, { size: 16 }),
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: row.status === ProductStatus.ON ? 'warning' : 'success',
              onClick: () => handleToggleStatus(row),
            },
            {
              default: () => (row.status === ProductStatus.ON ? '下架' : '上架'),
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleDeleteHost(row),
            },
            {
              default: () => '删除',
              icon: () => h(TrashIcon, { size: 16 }),
            },
          ),
        ],
      })
    },
  },
])

// 初始化
onMounted(async () => {
  await Promise.all([
    fetchHostList(),
    fetchCategoryOptions(),
  ])
})

// 获取司仪主持列表
async function fetchHostList() {
  try {
    loading.value = true

    const params: ProductQuery = {
      productType: ProductType.HOST,
      page: pagination.page,
      size: pagination.pageSize,
    }

    // 添加筛选条件
    if (searchForm.keyword)
      params.keyword = searchForm.keyword
    if (searchForm.categoryId)
      params.categoryId = searchForm.categoryId
    if (searchForm.minPrice)
      params.minPrice = searchForm.minPrice
    if (searchForm.maxPrice)
      params.maxPrice = searchForm.maxPrice
    if (searchForm.status !== null)
      params.status = searchForm.status

    // 如果有主持经验和主持风格，需要在后端增加对应的查询参数支持
    // 这里假设后端已支持这些参数
    if (searchForm.minExperience !== null) {
      (params as any).minExperience = searchForm.minExperience
    }
    if (searchForm.maxExperience !== null) {
      (params as any).maxExperience = searchForm.maxExperience
    }
    if (searchForm.hostingStyle) {
      (params as any).hostingStyle = searchForm.hostingStyle
    }

    const response = await getProductsByType(ProductType.HOST, params)

    if (response.success) {
      hostList.value = response.data.records as HostProduct[]
      pagination.itemCount = response.data.total
    } else {
      message.error(response.message || '获取司仪列表失败')
    }
  } catch (error) {
    console.error('获取司仪列表失败', error)
    message.error('获取司仪列表失败')
  } finally {
    loading.value = false
  }
}

// 获取分类选项
async function fetchCategoryOptions() {
  try {
    const response = await getCategoriesByType(ProductType.HOST)

    if (response.success) {
      categoryOptions.value = response.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }))
    }
  } catch (error) {
    console.error('获取分类选项失败', error)
  }
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchHostList()
}

// 重置搜索
function resetSearch() {
  searchForm.keyword = ''
  searchForm.categoryId = null
  searchForm.minPrice = null
  searchForm.maxPrice = null
  searchForm.minExperience = null
  searchForm.maxExperience = null
  searchForm.hostingStyle = ''
  searchForm.status = null

  pagination.page = 1
  fetchHostList()
}

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page
  fetchHostList()
}

// 查看司仪
function handleViewHost(row: HostProduct) {
  currentHost.value = { ...row }
  isEdit.value = false
  showDetailModal.value = true
}

// 编辑司仪
function handleEditHost(row: HostProduct) {
  currentHost.value = { ...row }
  isEdit.value = true
  showDetailModal.value = true
}

// 新增司仪
function handleAddHost() {
  currentHost.value = {
    merchantId: 0,
    productName: '',
    categoryId: 0,
    productType: ProductType.HOST,
    price: 0,
    status: ProductStatus.OFF,
  }
  isEdit.value = true
  showDetailModal.value = true
}

// 删除司仪
function handleDeleteHost(row: HostProduct) {
  if (!row.id)
    return

  // 确认删除
  window.$dialog.warning({
    title: '确认删除',
    content: `确定要删除司仪"${row.productName}"吗？此操作不可撤销。`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const response = await deleteProduct(row.id!)
        if (response.success) {
          message.success('删除成功')
          fetchHostList()
        } else {
          message.error(response.message || '删除失败')
        }
      } catch (error) {
        console.error('删除司仪失败', error)
        message.error('删除失败')
      }
    },
  })
}

// 切换状态
async function handleToggleStatus(row: HostProduct) {
  if (!row.id)
    return

  const newStatus = row.status === ProductStatus.ON ? ProductStatus.OFF : ProductStatus.ON
  const statusText = newStatus === ProductStatus.ON ? '上架' : '下架'

  try {
    const response = await updateProductStatus(row.id, newStatus)
    if (response.success) {
      message.success(`${statusText}成功`)
      fetchHostList()
    } else {
      message.error(response.message || `${statusText}失败`)
    }
  } catch (error) {
    console.error(`${statusText}司仪失败`, error)
    message.error(`${statusText}失败`)
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        司仪主持管理
      </h1>
      <NButton type="primary" @click="handleAddHost">
        <template #icon>
          <PlusIcon class="mr-1" />
        </template>
        新增司仪主持
      </NButton>
    </div>

    <!-- 搜索筛选 -->
    <NCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NFormItem label="司仪名称">
          <NInput v-model:value="searchForm.keyword" placeholder="请输入司仪名称" clearable />
        </NFormItem>

        <NFormItem label="主持风格">
          <NInput v-model:value="searchForm.hostingStyle" placeholder="请输入主持风格" clearable />
        </NFormItem>

        <NFormItem label="分类">
          <NSelect
            v-model:value="searchForm.categoryId"
            :options="categoryOptions"
            clearable
            placeholder="请选择分类"
          />
        </NFormItem>

        <NFormItem label="价格区间">
          <div class="flex items-center space-x-2">
            <NInputNumber
              v-model:value="searchForm.minPrice"
              placeholder="最低价"
              clearable
              class="w-full"
            />
            <span>-</span>
            <NInputNumber
              v-model:value="searchForm.maxPrice"
              placeholder="最高价"
              clearable
              class="w-full"
            />
          </div>
        </NFormItem>

        <NFormItem label="主持经验">
          <div class="flex items-center space-x-2">
            <NInputNumber
              v-model:value="searchForm.minExperience"
              placeholder="最低年限"
              clearable
              class="w-full"
            />
            <span>-</span>
            <NInputNumber
              v-model:value="searchForm.maxExperience"
              placeholder="最高年限"
              clearable
              class="w-full"
            />
          </div>
        </NFormItem>

        <NFormItem label="状态">
          <NSelect
            v-model:value="searchForm.status"
            :options="PRODUCT_STATUS_OPTIONS"
            clearable
            placeholder="请选择状态"
          />
        </NFormItem>
      </div>

      <div class="flex justify-end space-x-2 mt-4">
        <NButton @click="resetSearch">
          重置
        </NButton>
        <NButton type="primary" @click="handleSearch">
          搜索
        </NButton>
      </div>
    </NCard>

    <!-- 表格 -->
    <NCard>
      <NDataTable
        :columns="columns"
        :data="hostList"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        @update:page="handlePageChange"
      />
    </NCard>

    <!-- 详情/编辑弹窗 -->
    <DetailModal
      v-model:show="showDetailModal"
      :host="currentHost"
      :is-edit="isEdit"
      @refresh="fetchHostList"
    />
  </div>
</template>
