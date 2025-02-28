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
import type { HotelProduct, ProductQuery, SelectOption } from '~/api/product/type'
import HotelDetailModal from '~/components/hotel/admin/DetailModal.vue'

// 状态
const loading = ref(false)
const hotelList = ref<HotelProduct[]>([])
const showDetailModal = ref(false)
const isEdit = ref(false)
const currentHotel = ref<HotelProduct | null>(null)
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
  location: '',
  minPrice: null as number | null,
  maxPrice: null as number | null,
  minVenueSize: null as number | null,
  maxVenueSize: null as number | null,
  minTables: null as number | null,
  maxTables: null as number | null,
  cateringStyle: '',
  status: null as number | null,
})

// 表格列定义
const columns = computed<DataTableColumns<HotelProduct>>(() => [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '酒店图片',
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
    title: '酒店名称',
    key: 'productName',
    width: 160,
  },
  {
    title: '分类',
    key: 'categoryName',
    width: 120,
  },
  {
    title: '场地大小',
    key: 'venueSize',
    width: 100,
    render(row) {
      return row.venueSize ? `${row.venueSize}m²` : '未设置'
    },
  },
  {
    title: '最大桌数',
    key: 'maxTables',
    width: 100,
  },
  {
    title: '最小起订桌数',
    key: 'minTables',
    width: 100,
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
    title: '餐饮风格',
    key: 'cateringStyle',
    width: 150,
    render(row) {
      if (!row.cateringStyle)
        return '未设置'
      const styles = row.cateringStyle.split(',')
      return h(
        NSpace,
        { wrap: true, size: 'small' },
        {
          default: () => styles.map(style =>
            h(
              NTag,
              { size: 'small', type: 'info' },
              { default: () => style },
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
              onClick: () => handleViewHotel(row),
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
              onClick: () => handleEditHotel(row),
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
              onClick: () => handleDeleteHotel(row),
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
    fetchHotelList(),
    fetchCategoryOptions(),
  ])
})

// 获取婚宴酒店列表
async function fetchHotelList() {
  try {
    loading.value = true

    const params: ProductQuery = {
      productType: ProductType.HOTEL,
      page: pagination.page,
      size: pagination.pageSize,
    }

    // 添加筛选条件
    if (searchForm.keyword)
      params.keyword = searchForm.keyword
    if (searchForm.categoryId)
      params.categoryId = searchForm.categoryId
    if (searchForm.location)
      params.location = searchForm.location
    if (searchForm.minPrice)
      params.minPrice = searchForm.minPrice
    if (searchForm.maxPrice)
      params.maxPrice = searchForm.maxPrice
    if (searchForm.status !== null)
      params.status = searchForm.status

    // 添加特有的条件
    if (searchForm.minVenueSize !== null) {
      (params as any).minVenueSize = searchForm.minVenueSize
    }
    if (searchForm.maxVenueSize !== null) {
      (params as any).maxVenueSize = searchForm.maxVenueSize
    }
    if (searchForm.minTables !== null) {
      (params as any).minTables = searchForm.minTables
    }
    if (searchForm.maxTables !== null) {
      (params as any).maxTables = searchForm.maxTables
    }
    if (searchForm.cateringStyle) {
      (params as any).cateringStyle = searchForm.cateringStyle
    }

    const response = await getProductsByType(ProductType.HOTEL, params)

    if (response.success) {
      hotelList.value = response.data.records as HotelProduct[]
      pagination.itemCount = response.data.total
    } else {
      message.error(response.message || '获取婚宴酒店列表失败')
    }
  } catch (error) {
    console.error('获取婚宴酒店列表失败', error)
    message.error('获取婚宴酒店列表失败')
  } finally {
    loading.value = false
  }
}

// 获取分类选项
async function fetchCategoryOptions() {
  try {
    const response = await getCategoriesByType(ProductType.HOTEL)

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
  fetchHotelList()
}

// 重置搜索
function resetSearch() {
  searchForm.keyword = ''
  searchForm.categoryId = null
  searchForm.location = ''
  searchForm.minPrice = null
  searchForm.maxPrice = null
  searchForm.minVenueSize = null
  searchForm.maxVenueSize = null
  searchForm.minTables = null
  searchForm.maxTables = null
  searchForm.cateringStyle = ''
  searchForm.status = null

  pagination.page = 1
  fetchHotelList()
}

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page
  fetchHotelList()
}

// 查看婚宴酒店
function handleViewHotel(row: HotelProduct) {
  currentHotel.value = { ...row }
  isEdit.value = false
  showDetailModal.value = true
}

// 编辑婚宴酒店
function handleEditHotel(row: HotelProduct) {
  currentHotel.value = { ...row }
  isEdit.value = true
  showDetailModal.value = true
}

// 新增婚宴酒店
function handleAddHotel() {
  currentHotel.value = {
    merchantId: 0,
    productName: '',
    categoryId: 0,
    productType: ProductType.HOTEL,
    price: 0,
    status: ProductStatus.OFF,
  }
  isEdit.value = true
  showDetailModal.value = true
}

// 删除婚宴酒店
function handleDeleteHotel(row: HotelProduct) {
  if (!row.id)
    return

  // 确认删除
  window.$dialog.warning({
    title: '确认删除',
    content: `确定要删除婚宴酒店"${row.productName}"吗？此操作不可撤销。`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const response = await deleteProduct(row.id!)
        if (response.success) {
          message.success('删除成功')
          fetchHotelList()
        } else {
          message.error(response.message || '删除失败')
        }
      } catch (error) {
        console.error('删除婚宴酒店失败', error)
        message.error('删除失败')
      }
    },
  })
}

// 切换状态
async function handleToggleStatus(row: HotelProduct) {
  if (!row.id)
    return

  const newStatus = row.status === ProductStatus.ON ? ProductStatus.OFF : ProductStatus.ON
  const statusText = newStatus === ProductStatus.ON ? '上架' : '下架'

  try {
    const response = await updateProductStatus(row.id, newStatus)
    if (response.success) {
      message.success(`${statusText}成功`)
      fetchHotelList()
    } else {
      message.error(response.message || `${statusText}失败`)
    }
  } catch (error) {
    console.error(`${statusText}婚宴酒店失败`, error)
    message.error(`${statusText}失败`)
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        婚宴酒店管理
      </h1>
      <NButton type="primary" @click="handleAddHotel">
        <template #icon>
          <PlusIcon class="mr-1" />
        </template>
        新增婚宴酒店
      </NButton>
    </div>

    <!-- 搜索筛选 -->
    <NCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NFormItem label="酒店名称">
          <NInput v-model:value="searchForm.keyword" placeholder="请输入酒店名称" clearable />
        </NFormItem>

        <NFormItem label="分类">
          <NSelect
            v-model:value="searchForm.categoryId"
            :options="categoryOptions"
            clearable
            placeholder="请选择分类"
          />
        </NFormItem>

        <NFormItem label="位置">
          <NInput v-model:value="searchForm.location" placeholder="请输入位置" clearable />
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

        <NFormItem label="场地大小">
          <div class="flex items-center space-x-2">
            <NInputNumber
              v-model:value="searchForm.minVenueSize"
              placeholder="最小平米"
              clearable
              class="w-full"
            />
            <span>-</span>
            <NInputNumber
              v-model:value="searchForm.maxVenueSize"
              placeholder="最大平米"
              clearable
              class="w-full"
            />
          </div>
        </NFormItem>

        <NFormItem label="桌数">
          <div class="flex items-center space-x-2">
            <NInputNumber
              v-model:value="searchForm.minTables"
              placeholder="最少桌数"
              clearable
              class="w-full"
            />
            <span>-</span>
            <NInputNumber
              v-model:value="searchForm.maxTables"
              placeholder="最多桌数"
              clearable
              class="w-full"
            />
          </div>
        </NFormItem>

        <NFormItem label="餐饮风格">
          <NInput v-model:value="searchForm.cateringStyle" placeholder="请输入餐饮风格" clearable />
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
        :data="hotelList"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        @update:page="handlePageChange"
      />
    </NCard>

    <!-- 详情/编辑弹窗 -->
    <HotelDetailModal
      v-model:show="showDetailModal"
      :hotel="currentHotel"
      :is-edit="isEdit"
      @refresh="fetchHotelList"
    />
  </div>
</template>
