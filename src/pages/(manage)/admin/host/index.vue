<!-- ~/views/product/mc/index.vue -->
<script lang="ts" setup>
import { computed, h, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NCard,
  NDataTable,
  NDynamicTags,
  NForm,
  NFormItem,
  NGrid,
  NInput,
  NInputNumber,
  NModal,
  NRadio,
  NRadioGroup,
  NSelect,
  NSpace,
  NTag,
  NUpload,
} from 'naive-ui'
import type { FormRules, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { CheckIcon, EditIcon, PlusIcon, RefreshCwIcon, SearchIcon, TrashIcon, XIcon } from 'lucide-vue-next'
import {
  addMCProduct,
  changeProductStatus,
  deleteProductById,
  getProductById,
  pageProducts,
  updateMCProduct,
} from '~/api/host'
import type { MCProductDTO, MCProductQueryDTO } from '~/api/host/type'
import { ProductStatus, ProductStatusLabels, ProductTypes } from '~/constants/product'
import { uploadFile } from '~/api/file'

// Search form
const searchFormRef = ref()
const searchForm = reactive<MCProductQueryDTO>({
  page: 1,
  size: 10,
  productName: '',
  priceMin: undefined,
  priceMax: undefined,
  hostingExperienceMin: undefined,
  hostingExperienceMax: undefined,
  hostingStyle: '',
  productType: ProductTypes.MC,
  status: undefined,
})

// Options for select components
const statusOptions = [
  { label: ProductStatusLabels[ProductStatus.ONLINE], value: ProductStatus.ONLINE },
  { label: ProductStatusLabels[ProductStatus.OFFLINE], value: ProductStatus.OFFLINE },
]

// Table data
const tableRef = ref()
const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  pageSizes: [10, 20, 30, 50],
  showSizePicker: true,
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`
  },
})

// Table columns
const columns = [
  {
    title: '商品ID',
    key: 'id',
    width: 100,
  },
  {
    title: '商品名称',
    key: 'productName',
    width: 200,
  },
  {
    title: '主图',
    key: 'mainImage',
    width: 100,
    render(row) {
      return row.mainImage
        ? h('img', {
            src: row.mainImage,
            width: 60,
            height: 60,
            style: 'object-fit: cover; border-radius: 4px;',
          })
        : '无图片'
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
    title: '主持经验',
    key: 'hostingExperience',
    width: 100,
    render(row) {
      return row.hostingExperience ? `${row.hostingExperience}年` : '-'
    },
  },
  {
    title: '主持风格',
    key: 'hostingStyle',
    width: 150,
  },
  {
    title: '可用语言',
    key: 'languages',
    width: 150,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.status === ProductStatus.ONLINE ? 'success' : 'warning',
          size: 'small',
          round: true,
        },
        { default: () => ProductStatusLabels[row.status] },
      )
    },
  },
  {
    title: '评分',
    key: 'rating',
    width: 100,
    render(row) {
      return row.rating ? row.rating.toFixed(1) : '5.0'
    },
  },
  {
    title: '销量',
    key: 'sales',
    width: 100,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 200,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            ghost: true,
            class: 'mr-2',
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑', icon: () => h(EditIcon, { size: 14 }) },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: row.status === ProductStatus.ONLINE ? 'warning' : 'success',
            ghost: true,
            class: 'mr-2',
            onClick: () => handleStatusChange(row),
          },
          {
            default: () => row.status === ProductStatus.ONLINE ? '下架' : '上架',
            icon: () => h(row.status === ProductStatus.ONLINE ? XIcon : CheckIcon, { size: 14 }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            ghost: true,
            onClick: () => handleDelete(row),
          },
          { default: () => '删除', icon: () => h(TrashIcon, { size: 14 }) },
        ),
      ]
    },
  },
]

// Form for add/edit
const formRef = ref()
const formMode = ref<'add' | 'edit'>('add')
const showFormDialog = ref(false)
const formTitle = computed(() => formMode.value === 'add' ? '添加司仪主持商品' : '编辑司仪主持商品')

const formData = reactive<MCProductDTO>({
  id: 1,
  merchantId: 1,
  productName: '',
  categoryId: 2,
  productType: ProductTypes.MC,
  location: '',
  establishmentYears: 1,
  price: 2,
  mainImage: '',
  subImages: '',
  description: '',
  tags: '',
  detail: '',
  hostingExperience: 1,
  hostingStyle: '',
  languages: '',
  stock: 3,
  status: ProductStatus.ONLINE,
})

// Form validation rules
const formRules: FormRules = {
  productName: {
    required: true,
    message: '请输入商品名称',
    trigger: 'blur',
  },
  merchantId: {
    required: true,
    message: '请输入商家ID',
    trigger: 'blur',
  },
  categoryId: {
    required: true,
    message: '请输入分类ID',
    trigger: 'blur',
  },
  price: {
    required: true,
    message: '请输入商品价格',
    trigger: 'blur',
  },
}

// Upload related
const mainImageFileList = ref<UploadFileInfo[]>([])
const subImagesFileList = ref<UploadFileInfo[]>([])
const tagsList = ref<string[]>([])

// Methods
async function fetchProducts() {
  try {
    loading.value = true
    const res = await pageProducts(searchForm)
    if (res.success) {
      tableData.value = res.data.records
      pagination.itemCount = res.data.total
      pagination.page = res.data.current
      pagination.pageSize = res.data.size
    } else {
      window.$message.error(res.message || '获取商品列表失败')
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    window.$message.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  fetchProducts()
}

function resetSearch() {
  searchFormRef.value?.restoreValidation()
  Object.assign(searchForm, {
    page: 1,
    size: 10,
    productName: '',
    priceMin: null,
    priceMax: null,
    hostingExperienceMin: null,
    hostingExperienceMax: null,
    hostingStyle: '',
    productType: ProductTypes.MC,
    status: null,
  })
  fetchProducts()
}

function handlePageChange(page: number) {
  searchForm.page = page
  fetchProducts()
}

function handlePageSizeChange(pageSize: number) {
  searchForm.size = pageSize
  searchForm.page = 1
  fetchProducts()
}

function initFormData() {
  Object.assign(formData, {
    id: null,
    merchantId: null,
    productName: '',
    categoryId: null,
    productType: ProductTypes.MC,
    location: '',
    establishmentYears: null,
    price: null,
    mainImage: '',
    subImages: '',
    description: '',
    tags: '',
    detail: '',
    hostingExperience: null,
    hostingStyle: '',
    languages: '',
    stock: null,
    status: ProductStatus.ONLINE,
  })
  mainImageFileList.value = []
  subImagesFileList.value = []
  tagsList.value = []
}

function openAddDialog() {
  formMode.value = 'add'
  initFormData()
  showFormDialog.value = true
}

async function handleEdit(row) {
  formMode.value = 'edit'
  initFormData()

  try {
    const res = await getProductById(row.id)
    if (res.success && res.data) {
      // Populate form data
      Object.assign(formData, res.data)

      // Set tags
      if (res.data.tags) {
        tagsList.value = res.data.tags.split(',')
      }

      // Set images
      if (res.data.mainImage) {
        mainImageFileList.value = [{
          id: 'main',
          name: 'main-image',
          status: 'finished',
          url: res.data.mainImage,
        }]
      }

      if (res.data.subImages) {
        try {
          const subImages = JSON.parse(res.data.subImages)
          subImagesFileList.value = subImages.map((url, index) => ({
            id: `sub-${index}`,
            name: `sub-image-${index}`,
            status: 'finished',
            url,
          }))
        } catch (e) {
          console.error('Error parsing sub images:', e)
        }
      }

      showFormDialog.value = true
    } else {
      window.$message.error(res.message || '获取商品详情失败')
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    window.$message.error('获取商品详情失败')
  }
}

function handleDelete(row) {
  window.$dialog.warning({
    title: '删除确认',
    content: `确定要删除 "${row.productName}" 吗？删除后无法恢复。`,
    positiveText: '确定删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const res = await deleteProductById(row.id)
        if (res.success) {
          window.$message.success('商品删除成功')
          fetchProducts()
        } else {
          window.$message.error(res.message || '删除失败')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        window.$message.error('删除失败')
      }
    },
  })
}

function handleStatusChange(row) {
  const newStatus = row.status === ProductStatus.ONLINE ? ProductStatus.OFFLINE : ProductStatus.ONLINE
  const statusText = newStatus === ProductStatus.ONLINE ? '上架' : '下架'

  window.$dialog.info({
    title: `${statusText}确认`,
    content: `确定要${statusText} "${row.productName}" 吗？`,
    positiveText: `确定${statusText}`,
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const res = await changeProductStatus(row.id, newStatus)
        if (res.success) {
          window.$message.success(`商品${statusText}成功`)
          fetchProducts()
        } else {
          window.$message.error(res.message || `${statusText}失败`)
        }
      } catch (error) {
        console.error(`Error changing status:`, error)
        window.$message.error(`${statusText}失败`)
      }
    },
  })
}

function closeFormDialog() {
  formRef.value?.restoreValidation()
  showFormDialog.value = false
}

async function handleFormSubmit(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate()

  // Update tags from tagsList
  formData.tags = tagsList.value.join(',')

  // Update subImages from subImagesFileList
  if (subImagesFileList.value.length > 0) {
    const imageUrls = subImagesFileList.value.map(file => file.url)
    formData.subImages = JSON.stringify(imageUrls)
  } else {
    formData.subImages = ''
  }

  try {
    let res
    if (formMode.value === 'add') {
      res = await addMCProduct(formData)
    } else {
      res = await updateMCProduct(formData)
    }

    if (res.success) {
      window.$message.success(formMode.value === 'add' ? '添加成功' : '更新成功')
      closeFormDialog()
      fetchProducts()
    } else {
      window.$message.error(res.message || (formMode.value === 'add' ? '添加失败' : '更新失败'))
    }
  } catch (error) {
    console.error(`Error ${formMode.value === 'add' ? 'adding' : 'updating'} product:`, error)
    window.$message.error(formMode.value === 'add' ? '添加失败' : '更新失败')
  }
}

async function customUploadRequest(options: UploadCustomRequestOptions) {
  const { file, onFinish, onError } = options

  try {
    const res = await uploadFile({
      file: file.file,
    })

    if (res.success && res.data?.url) {
      const fileInfo = {
        id: file.id,
        name: file.name,
        status: 'finished',
        url: res.data.url,
      }

      // If it's a main image upload
      if (options.file.id === 'main' || mainImageFileList.value.length === 0) {
        mainImageFileList.value = [fileInfo]
        formData.mainImage = res.data.url
      } else {
        subImagesFileList.value.push(fileInfo)
      }

      onFinish()
    } else {
      onError()
      window.$message.error(res.message || '上传失败')
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    onError()
    window.$message.error('上传失败')
  }
}

function handleMainImageRemove() {
  mainImageFileList.value = []
  formData.mainImage = ''
}

function handleSubImageRemove(options: { file: UploadFileInfo }) {
  const index = subImagesFileList.value.findIndex(item => item.id === options.file.id)
  if (index !== -1) {
    subImagesFileList.value.splice(index, 1)
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div>
    <NCard title="司仪主持商品管理" class="mb-4">
      <template #header-extra>
        <NButton type="primary" @click="openAddDialog">
          <template #icon>
            <PlusIcon class="mr-1" />
          </template>
          添加司仪主持
        </NButton>
      </template>

      <!-- Search Form -->
      <NForm
        ref="searchFormRef"
        :model="searchForm"
        label-placement="left"
        label-width="auto"
        inline
        class="w-full"
      >
        <NFormItem label="司仪名称" path="productName">
          <NInput
            v-model:value="searchForm.productName"
            placeholder="请输入司仪名称"
            clearable
          />
        </NFormItem>
        <NFormItem label="状态" path="status">
          <div class="w-40">
            <NSelect
              v-model:value="searchForm.status"
              :options="statusOptions"
              placeholder="请选择商品状态"
              clearable
            />
          </div>
        </NFormItem>
        <NSpace justify="end">
          <NButton type="primary" @click="handleSearch">
            <template #icon>
              <SearchIcon class="mr-1" />
            </template>
            搜索
          </NButton>
          <NButton class="ml-2" @click="resetSearch">
            <template #icon>
              <RefreshCwIcon class="mr-1" />
            </template>
            重置
          </NButton>
        </NSpace>
      </NForm>

      <!-- Data Table -->
      <NDataTable
        ref="tableRef"
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        border
        striped
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </NCard>

    <!-- Add/Edit Form Dialog -->
    <NModal
      v-model:show="showFormDialog"
      preset="dialog"
      :title="formTitle"
      :positive-text="formMode === 'add' ? '添加' : '更新'"
      negative-text="取消"
      style="width: 800px"
      @positive-click="handleFormSubmit"
      @negative-click="closeFormDialog"
    >
      <NForm
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <NGrid :cols="24" :x-gap="24">
          <NFormItem label="商品名称" path="productName" :span="12">
            <NInput
              v-model:value="formData.productName"
              placeholder="请输入商品名称"
            />
          </NFormItem>
          <NFormItem label="商家ID" path="merchantId" :span="12">
            <NInputNumber
              v-model:value="formData.merchantId"
              placeholder="请输入商家ID"
              :min="1"
            />
          </NFormItem>
          <NFormItem label="分类ID" path="categoryId" :span="12">
            <NInputNumber
              v-model:value="formData.categoryId"
              placeholder="请输入分类ID"
              :min="1"
            />
          </NFormItem>
          <NFormItem label="价格" path="price" :span="12">
            <NInputNumber
              v-model:value="formData.price"
              placeholder="请输入商品价格"
              :min="0"
              :precision="2"
            />
          </NFormItem>
          <NFormItem label="位置/地址" path="location" :span="12">
            <NInput
              v-model:value="formData.location"
              placeholder="请输入位置/地址"
            />
          </NFormItem>
          <NFormItem label="成立年限" path="establishmentYears" :span="12">
            <NInputNumber
              v-model:value="formData.establishmentYears"
              placeholder="请输入成立年限"
              :min="0"
            />
          </NFormItem>
          <NFormItem label="主持经验(年)" path="hostingExperience" :span="12">
            <NInputNumber
              v-model:value="formData.hostingExperience"
              placeholder="请输入主持经验年限"
              :min="0"
            />
          </NFormItem>
          <NFormItem label="主持风格" path="hostingStyle" :span="12">
            <NInput
              v-model:value="formData.hostingStyle"
              placeholder="请输入主持风格"
            />
          </NFormItem>
          <NFormItem label="可用语言" path="languages" :span="12">
            <NInput
              v-model:value="formData.languages"
              placeholder="请输入可用语言，用逗号分隔"
            />
          </NFormItem>
          <NFormItem label="主图" path="mainImage" :span="12">
            <NUpload
              action="/"
              :custom-request="customUploadRequest"
              :max="1"
              list-type="image-card"
              :default-file-list="mainImageFileList"
              @remove="handleMainImageRemove"
            >
              上传主图
            </NUpload>
          </NFormItem>
          <NFormItem label="子图" path="subImages" :span="24">
            <NUpload
              action="/"
              :custom-request="customUploadRequest"
              list-type="image-card"
              :default-file-list="subImagesFileList"
              @remove="handleSubImageRemove"
            >
              上传子图
            </NUpload>
          </NFormItem>
          <NFormItem label="简短描述" path="description" :span="24">
            <NInput
              v-model:value="formData.description"
              type="textarea"
              placeholder="请输入简短描述"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </NFormItem>
          <NFormItem label="标签" path="tags" :span="24">
            <NDynamicTags v-model:value="tagsList" />
          </NFormItem>
          <NFormItem label="详细描述" path="detail" :span="24">
            <NInput
              v-model:value="formData.detail"
              type="textarea"
              placeholder="请输入详细描述"
              :autosize="{ minRows: 4, maxRows: 8 }"
            />
          </NFormItem>
          <NFormItem label="库存" path="stock" :span="12">
            <NInputNumber
              v-model:value="formData.stock"
              placeholder="请输入库存"
              :min="0"
            />
          </NFormItem>
          <NFormItem label="状态" path="status" :span="12">
            <NRadioGroup v-model:value="formData.status">
              <NRadio :value="1">
                上架
              </NRadio>
              <NRadio :value="0">
                下架
              </NRadio>
            </NRadioGroup>
          </NFormItem>
        </NGrid>
      </NForm>
    </NModal>
  </div>
</template>
